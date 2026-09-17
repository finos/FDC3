/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '@finos/fdc3-context';
import {
  AppIdentifier,
  AppProvidableContextMetadata,
  ContextMetadata,
  ContextWithMetadata,
  DesktopAgent,
  IntentResolution,
} from '@finos/fdc3-standard';
import * as jose from 'jose';
import { JosePrivateFDC3Security, createJosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { JWKSResolver } from '../src/impl/JosePublicFDC3Security';
import { JsonWebKeyWithId } from '../src/impl/PublicFDC3Security';
import { MetadataHandlerImpl } from '../src/delegates/MetadataHandler';
import {
  BasicSignedIntentResultSupport,
  PrivateSignedIntentResultSupport,
} from '../src/signing/SignedIntentResultSupport';
import {
  BasicSignedRaiseIntentSupport,
  PrivateSignedRaiseIntentSupport,
  VerifiedIntentResolution,
} from '../src/signing/SignedRaiseIntentSupport';

const soloBaseUrl = 'https://signed-intent.test';

function createJWKSResolver(keys: JsonWebKeyWithId[]): JWKSResolver {
  const resolver = async (
    protectedHeader?: jose.JWSHeaderParameters,
    _token?: jose.FlattenedJWSInput
  ): Promise<CryptoKey> => {
    const key = keys.find(
      k => (k.kid === protectedHeader?.kid || protectedHeader?.kid == null) && k.alg === protectedHeader?.alg
    );
    if (!key) {
      throw new Error(`No key found for kid: ${protectedHeader?.kid}`);
    }
    const cryptoKey = await jose.importJWK(key as jose.JWK, protectedHeader?.alg);
    if (!(cryptoKey instanceof CryptoKey)) {
      throw new Error('Failed to import JWK as CryptoKey');
    }
    return cryptoKey;
  };
  resolver.coolingDown = false;
  resolver.fresh = true;
  resolver.reloading = false;
  resolver.reload = async (): Promise<void> => {
    /* JWKSResolver contract */
  };
  resolver.jwks = () => ({ keys: keys as jose.JWK[] });
  return resolver as JWKSResolver;
}

async function createSoloSecurity(): Promise<JosePrivateFDC3Security> {
  const holder: { ref?: JosePrivateFDC3Security } = {};
  const solo = await createJosePrivateFDC3Security(
    soloBaseUrl,
    () => {
      if (!holder.ref) {
        throw new Error('JWKS resolver invoked before JosePrivateFDC3Security construction finished');
      }
      return createJWKSResolver(holder.ref.getPublicKeys());
    },
    () => true
  );
  holder.ref = solo;
  return solo;
}

/** Minimal stand-in for tests; cast to DesktopAgent when wiring SignedRaiseIntentSupport. */
class CapturingDesktopAgent {
  lastRaiseIntent?: {
    intent: string;
    context: Context;
    app?: AppIdentifier;
    newInstance?: boolean | null;
    metadata?: AppProvidableContextMetadata;
  };
  lastRaiseForContext?: {
    context: Context;
    app?: AppIdentifier;
    newInstance?: boolean | null;
    metadata?: AppProvidableContextMetadata;
  };
  constructor(public nextResolution: IntentResolution) {}

  async raiseIntent(
    intent: string,
    context: Context,
    app?: AppIdentifier,
    newInstance?: boolean | null,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution> {
    this.lastRaiseIntent = { intent, context, app, newInstance, metadata };
    return this.nextResolution;
  }

  async raiseIntentForContext(
    context: Context,
    app?: AppIdentifier,
    newInstance?: boolean | null,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution> {
    this.lastRaiseForContext = { context, app, newInstance, metadata };
    return this.nextResolution;
  }
}

function intentResolution(resultContext: Context, resultMetadata: ContextMetadata, intent: string): IntentResolution {
  return {
    source: { appId: 'handler', instanceId: 'h1' },
    intent: intent as IntentResolution['intent'],
    getResult: async () => resultContext,
    getResultMetadata: async () => resultMetadata,
  };
}

const metadataAvailabilityCases = [
  { label: 'metadata packed in context (__appMeta)', metadataAvailable: false },
  { label: 'metadata passed separately (FDC3 3.0+)', metadataAvailable: true },
] as const;

describe.each(metadataAvailabilityCases)('BasicSignedIntentResultSupport ($label)', ({ metadataAvailable }) => {
  const metadataHandler = new MetadataHandlerImpl(metadataAvailable);
  let solo: JosePrivateFDC3Security;

  beforeAll(async () => {
    solo = await createSoloSecurity();
  });

  it('returns void unchanged', async () => {
    const support = new BasicSignedIntentResultSupport(ctx => solo.sign(ctx), metadataHandler);
    await expect(support.signIntentResult(undefined as never)).resolves.toBeUndefined();
  });

  it('returns channel results unchanged', async () => {
    const support = new BasicSignedIntentResultSupport(ctx => solo.sign(ctx), metadataHandler);
    const ch = { type: 'private' as const, id: 'pc-1', displayMetadata: { name: 'x', color: 'blue' } };
    await expect(support.signIntentResult(ch as never)).resolves.toEqual(ch);
  });

  it('signs a context result and embeds metadata via MetadataHandler', async () => {
    const support = new BasicSignedIntentResultSupport(ctx => solo.sign(ctx), metadataHandler);
    const response: Context = { type: 'demo.response', id: { ok: true } };
    const out = (await support.signIntentResult(response)) as ContextWithMetadata;
    expect(out.context.type).toBe('demo.response');
    expect(out.metadata?.signature).toBeDefined();
    expect(out.metadata?.antiReplay).toBeDefined();
    if (metadataAvailable) {
      expect((out.context as Context & { __appMeta?: unknown }).__appMeta).toBeUndefined();
    } else {
      expect((out.context as Context & { __appMeta?: unknown }).__appMeta).toBeDefined();
    }
  });
});

describe.each(metadataAvailabilityCases)('PrivateSignedIntentResultSupport ($label)', ({ metadataAvailable }) => {
  const metadataHandler = new MetadataHandlerImpl(metadataAvailable);
  let solo: JosePrivateFDC3Security;

  beforeAll(async () => {
    solo = await createSoloSecurity();
  });

  it('delegates signing to PrivateFDC3Security', async () => {
    const support = new PrivateSignedIntentResultSupport(solo, metadataHandler);
    const response: Context = { type: 'demo.response', id: { n: 2 } };
    const out = (await support.signIntentResult(response)) as ContextWithMetadata;
    expect(out.metadata?.signature).toBeDefined();
    if (metadataAvailable) {
      expect((out.context as Context & { __appMeta?: unknown }).__appMeta).toBeUndefined();
    } else {
      expect((out.context as Context & { __appMeta?: unknown }).__appMeta).toBeDefined();
    }
  });
});

describe.each(metadataAvailabilityCases)(
  'BasicSignedRaiseIntentSupport / PrivateSignedRaiseIntentSupport ($label)',
  ({ metadataAvailable }) => {
    const metadataHandler = new MetadataHandlerImpl(metadataAvailable);
    let solo: JosePrivateFDC3Security;

    beforeAll(async () => {
      solo = await createSoloSecurity();
    });

    it('raiseIntent signs the outbound context and passes packed context to the DesktopAgent', async () => {
      const input: Context = { type: 'fdc3.instrument', id: { ticker: 'MSFT' }, name: 'Microsoft' };
      const response: Context = { type: 'demo.response', id: { status: 'ok' } };
      const { signature, antiReplay } = await solo.sign(response);
      const packedResponse = metadataHandler.pack(response, { signature, antiReplay });

      const da = new CapturingDesktopAgent(
        intentResolution(packedResponse.context, packedResponse.metadata, 'DataTransfer')
      );
      const support = new PrivateSignedRaiseIntentSupport(da as unknown as DesktopAgent, solo, metadataHandler);

      const resolution = await support.raiseIntent('DataTransfer', input);
      expect(da.lastRaiseIntent?.intent).toBe('DataTransfer');
      expect(da.lastRaiseIntent?.context).toMatchObject({ type: 'fdc3.instrument', id: { ticker: 'MSFT' } });
      if (metadataAvailable) {
        expect((da.lastRaiseIntent?.context as Context & { __appMeta?: unknown }).__appMeta).toBeUndefined();
        expect(da.lastRaiseIntent?.metadata?.signature).toBeDefined();
        expect(da.lastRaiseIntent?.metadata?.antiReplay).toBeDefined();
      } else {
        expect((da.lastRaiseIntent?.context as Context & { __appMeta?: unknown }).__appMeta).toBeDefined();
      }

      const result = await resolution.getResult();
      expect(result).toMatchObject({ type: 'demo.response' });
      if (metadataAvailable) {
        const verification = await (resolution as VerifiedIntentResolution).getVerification();
        expect(verification?.authenticity).toMatchObject({ signed: true, valid: true });
        expect((result as Context & { __appMeta?: unknown }).__appMeta).toBeUndefined();
      } else {
        // In pre-3.0 mode metadata is packed into __appMeta; verification is still via getVerification()
        const verification = await (resolution as VerifiedIntentResolution).getVerification();
        expect(verification?.authenticity).toMatchObject({ signed: true, valid: true });
      }
    });

    it('raiseIntentForContext signs and calls raiseIntentForContext on the DesktopAgent', async () => {
      const input: Context = { type: 'fdc3.country', id: { iso: 'GB' } };
      const response: Context = { type: 'demo.response', id: { done: true } };
      const { signature, antiReplay } = await solo.sign(response);
      const packedResponse = metadataHandler.pack(response, { signature, antiReplay });

      const da = new CapturingDesktopAgent(
        intentResolution(packedResponse.context, packedResponse.metadata, 'ForContext')
      );
      const support = new PrivateSignedRaiseIntentSupport(da as unknown as DesktopAgent, solo, metadataHandler);

      await support.raiseIntentForContext(input, { appId: 'target', instanceId: 't1' } as AppIdentifier);
      expect(da.lastRaiseForContext?.context).toMatchObject({ type: 'fdc3.country' });
      if (metadataAvailable) {
        expect((da.lastRaiseForContext?.context as Context & { __appMeta?: unknown }).__appMeta).toBeUndefined();
        expect(da.lastRaiseForContext?.metadata?.signature).toBeDefined();
        expect(da.lastRaiseForContext?.metadata?.antiReplay).toBeDefined();
      } else {
        expect((da.lastRaiseForContext?.context as Context & { __appMeta?: unknown }).__appMeta).toBeDefined();
      }
      expect(da.lastRaiseForContext?.app).toEqual({ appId: 'target', instanceId: 't1' });
    });

    it('passes resolution through unchanged when no signature checker is configured', async () => {
      const input: Context = { type: 'fdc3.instrument', id: { ticker: 'A' } };
      const da = new CapturingDesktopAgent(
        intentResolution(
          { type: 'demo.response', id: { plain: true } },
          { source: { appId: 'h', instanceId: '1' }, timestamp: new Date(), traceId: 't' },
          'X'
        )
      );
      const support = new BasicSignedRaiseIntentSupport(
        da as unknown as DesktopAgent,
        ctx => solo.sign(ctx),
        metadataHandler
      );
      const resolution = await support.raiseIntent('X', input);
      const result = await resolution.getResult();
      expect(result).toEqual({ type: 'demo.response', id: { plain: true } });
    });
  }
);
