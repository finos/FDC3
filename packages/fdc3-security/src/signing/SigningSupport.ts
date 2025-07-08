import { Channel, Context, ContextHandler, ContextMetadata, IntentHandler, IntentResult } from '@finos/fdc3';
import { SecuredDesktopAgent } from '../SecuredDesktopAgent';
import { canonicalize } from 'json-canonicalize';

export type Sign = (msg: string, date: Date) => Promise<MessageSignature>;
export type Check = (p: MessageSignature, msg: string) => Promise<MessageAuthenticity>;

/**
 * This is the field that is added to the context object to contain the signature
 */
export const SIGNATURE_KEY = '__signature';
export const AUTHENTICITY_KEY = 'authenticity';

export const SIGNING_ALGORITHM_DETAILS = {
  name: 'ECDSA',
  hash: 'SHA-512',
  namedCurve: 'P-521',
} as EcdsaParams;

export const SIGNING_ALGORITHM_KEY_PARAMS: EcKeyGenParams = {
  ...SIGNING_ALGORITHM_DETAILS,
  namedCurve: 'P-521',
};

export type MessageSignature = {
  digest: string;
  publicKeyUrl: string;
  algorithm: any;
  date: string;
};

export type MessageAuthenticity =
  | {
      verified: true;
      valid: boolean;
      publicKeyUrl: string;
    }
  | {
      verified: false;
      error: any;
    };

export type ContextMetadataWithAuthenticity = ContextMetadata & {
  authenticity?: MessageAuthenticity;
};

export async function contentToSign(
  context: Context,
  timestamp: Date | string,
  intent?: string,
  channelId?: string
): Promise<string> {
  return canonicalize({
    context,
    intent,
    timestamp,
    channelId,
  });
}

export async function signedContext(
  sign: Sign,
  context: Context,
  intent?: string,
  channelId?: string
): Promise<Context> {
  delete context[SIGNATURE_KEY];
  const ts = new Date();
  return sign(await contentToSign(context, ts, intent, channelId), ts).then(sig => {
    context[SIGNATURE_KEY] = sig;
    return context;
  });
}

export function signingContextHandler(
  check: Check,
  handler: ContextHandler,
  channelProvider: () => Promise<Channel | null>
): ContextHandler {
  const out = (c: Context, m: ContextMetadataWithAuthenticity | undefined) => {
    if (c[SIGNATURE_KEY]) {
      // context is signed, so check it.
      const signature = c[SIGNATURE_KEY] as MessageSignature;
      delete c[SIGNATURE_KEY];

      return channelProvider()
        .then(channel => contentToSign(c, signature.date, undefined, channel?.id))
        .then(messageToCheck => check(signature, messageToCheck))
        .then(r => {
          const m2: ContextMetadataWithAuthenticity = m == undefined ? ({} as ContextMetadataWithAuthenticity) : m;
          m2[AUTHENTICITY_KEY] = r;
          return handler(c, m2);
        })
        .catch(e => {
          console.log("Couldn't check signature");
          const m2: ContextMetadataWithAuthenticity = m == undefined ? ({} as ContextMetadataWithAuthenticity) : m;
          m2[AUTHENTICITY_KEY] = {
            verified: false,
            error: e,
          };
          return handler(c, m2);
        });
    } else {
      if (m) {
        delete m[AUTHENTICITY_KEY];
      }
      return handler(c, m);
    }
  };

  return out as ContextHandler;
}

async function wrapIntentResult(ir: IntentResult, da: SecuredDesktopAgent, intentName: string): Promise<IntentResult> {
  if (ir == undefined) {
    return;
  } else if (ir.type == 'app' || ir.type == 'user' || ir.type == 'private') {
    // it's a channel, just return as-is
    return ir;
  } else {
    // it's a context
    return signedContext(da.sign, ir as Context, intentName, undefined);
  }
}

export function signingIntentHandler(
  da: SecuredDesktopAgent,
  handler: IntentHandler,
  intentName: string
): IntentHandler {
  const out = (c: Context, m: ContextMetadataWithAuthenticity | undefined) => {
    async function checkSignature(): Promise<{ context: Context; meta: ContextMetadataWithAuthenticity | undefined }> {
      const signature = c[SIGNATURE_KEY] as MessageSignature;
      if (signature) {
        delete c[SIGNATURE_KEY];
        const toSign = await contentToSign(c, signature.date, intentName);
        const auth = await da.check(signature, toSign);
        return {
          context: c,
          meta: {
            ...(m as any),
            authenticity: auth,
          },
        };
      } else {
        return {
          context: c,
          meta: {
            ...(m as any),
            authenticity: {
              verified: false,
            },
          },
        };
      }
    }

    async function applyHandler(context: Context, meta: ContextMetadata | undefined): Promise<IntentResult> {
      const result = await handler(context, meta);
      const wrapped = await wrapIntentResult(result, da, intentName);
      return wrapped;
    }

    return checkSignature().then(({ context, meta }) => applyHandler(context, meta));
  };

  return out;
}
