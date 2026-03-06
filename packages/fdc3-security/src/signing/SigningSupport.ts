import {
  ContextHandler,
  IntentHandler,
  IntentResult,
  Channel,
  DesktopAgentProvidableContextMetadata,
} from '@finos/fdc3-standard';
import { PrivateFDC3Security } from '../impl/PrivateFDC3Security';
import { Context } from '@finos/fdc3-context';
import { BrowserTypes } from '@finos/fdc3-schema';
import { PublicFDC3Security } from '../impl/PublicFDC3Security';

type DetachedSignature = BrowserTypes.DetachedSignature;
type MessageAuthenticity = BrowserTypes.MessageAuthenticity;
type AntiReplayClaims = BrowserTypes.AntiReplayClaims;

/**
 * Extended metadata for handlers that includes signature verification results.
 */
export type ContextMetadataWithAuthenticity = DesktopAgentProvidableContextMetadata & {
  authenticity?: MessageAuthenticity;
};

export async function signedContext(fdc3Security: PrivateFDC3Security, context: Context): Promise<Context> {
  const unsignedContext = { ...context };
  // @ts-ignore
  delete unsignedContext['__signature'];
  // @ts-ignore
  delete unsignedContext['__antiReplay'];

  const { signature, antiReplay } = await fdc3Security.sign(unsignedContext);
  const out = { ...unsignedContext };
  // @ts-ignore
  out['__signature'] = signature;
  // @ts-ignore
  out['__antiReplay'] = antiReplay;
  return out;
}

export async function checkSignature(
  fdc3Security: PublicFDC3Security,
  m: DesktopAgentProvidableContextMetadata | undefined,
  c: Context,
  _intent: string | null,
  _channelId: string | null
): Promise<{ context: Context; meta: ContextMetadataWithAuthenticity | undefined }> {
  let signature: DetachedSignature | null = null;
  let antiReplay: AntiReplayClaims | null = null;
  const unsignedContext: Context = { ...c };
  // @ts-ignore
  delete unsignedContext['__signature'];
  // @ts-ignore
  delete unsignedContext['__antiReplay'];

  // Check metadata for signature (standard FDC3 Security 2.0)
  if (m != null && (m as any).signature) {
    signature = (m as any).signature;
    antiReplay = (m as any).antiReplay;
  }
  // Check context for __signature (alternative/legacy context wrapping)
  else if ((c as any)['__signature']) {
    signature = (c as any)['__signature'] as DetachedSignature;
    antiReplay = (c as any)['__antiReplay'] as AntiReplayClaims;
  }

  if (signature && antiReplay) {
    const res = await fdc3Security.check(signature, unsignedContext, antiReplay);
    const m2: ContextMetadataWithAuthenticity = m == undefined ? ({} as ContextMetadataWithAuthenticity) : { ...m };
    m2['authenticity'] = res;
    return {
      context: unsignedContext,
      meta: m2,
    };
  } else {
    const m2 = m ? ({ ...m } as ContextMetadataWithAuthenticity) : ({} as ContextMetadataWithAuthenticity);
    m2.authenticity = {
      signed: false,
      errors: ['No signature or anti-replay claims found'],
    };
    return {
      context: unsignedContext,
      meta: m2,
    };
  }
}

export function signingContextHandler(
  fdc3Security: PublicFDC3Security,
  handler: ContextHandler,
  channelProvider: () => Promise<Channel | null>
): ContextHandler {
  return async (c: Context, m: DesktopAgentProvidableContextMetadata | undefined) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = await checkSignature(fdc3Security, m, c, null, (await channelProvider())?.id ?? null);
    handler(res.context, res.meta as any);
  };
}

export function signingIntentHandler(
  fdc3Security: PrivateFDC3Security,
  handler: IntentHandler,
  intentName: string
): IntentHandler {
  return async (c: Context, m: DesktopAgentProvidableContextMetadata | undefined) => {
    async function wrapIntentResult(ir: IntentResult): Promise<IntentResult> {
      if (ir == undefined) {
        return;
      } else if (
        typeof ir === 'object' &&
        ('id' in ir || 'type' in ir) &&
        !('type' in (ir as any) && ['user', 'app', 'private'].includes((ir as any).type))
      ) {
        // it's a context
        return signedContext(fdc3Security, ir as Context);
      } else {
        // it's a channel or other result
        return ir;
      }
    }

    const res = await checkSignature(fdc3Security, m, c, intentName, null);
    const result = await handler(res.context, res.meta as any);
    return await wrapIntentResult(result);
  };
}
