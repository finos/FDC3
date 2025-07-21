import { Channel, ContextHandler, ContextMetadata, IntentHandler, IntentResult } from '@finos/fdc3-standard';
import { FDC3Security, JSONWebSignature, MessageAuthenticity } from '../FDC3Security';
import { Context } from '@finos/fdc3-context';

export type ContextMetadataWithAuthenticity = ContextMetadata & {
  authenticity?: MessageAuthenticity;
  __signature?: JSONWebSignature;
};

export async function signedContext(
  fdc3Security: FDC3Security,
  context: Context,
  intent: string | null,
  channelId: string | null
): Promise<Context> {
  let unsignedContext = { ...context };
  delete unsignedContext['__signature'];

  return fdc3Security.sign(unsignedContext, intent, channelId).then(sig => {
    let out = { ...unsignedContext };
    out['__signature'] = sig;
    return out;
  });
}

type X = ContextHandler | IntentHandler;

export async function checkSignature(
  fdc3Security: FDC3Security,
  m: ContextMetadataWithAuthenticity | undefined,
  c: Context,
  intent: string | null,
  channelId: string | null
): Promise<{ context: Context; meta: ContextMetadataWithAuthenticity | undefined }> {
  let signature: JSONWebSignature | null = null;
  let unsignedContext: Context | undefined = { ...c };
  delete unsignedContext['__signature'];

  if (m != null && m['__signature']) {
    signature = m['__signature'];
  } else if (c['__signature']) {
    // context is signed, so check it.
    signature = c['__signature'] as JSONWebSignature;
  }

  if (signature) {
    const res = await fdc3Security.check(signature, unsignedContext, intent, channelId);
    const m2: ContextMetadataWithAuthenticity = m == undefined ? ({} as ContextMetadataWithAuthenticity) : m;
    m2['authenticity'] = res;
    return {
      context: unsignedContext,
      meta: m2,
    };
  } else {
    const m2 = m ? { ...m } : ({} as ContextMetadataWithAuthenticity);
    delete m2['authenticity'];
    m2.authenticity = {
      verified: false,
    };
    return {
      context: unsignedContext,
      meta: m2,
    };
  }
}

export function signingContextHandler(
  fdc3Security: FDC3Security,
  handler: ContextHandler,
  channelProvider: () => Promise<Channel | null>
): X {
  const out = async (c: Context, m: ContextMetadataWithAuthenticity | undefined) => {
    const res = await checkSignature(fdc3Security, m, c, null, (await channelProvider())?.id ?? null);
    handler(res.context, res.meta);
  };

  return out as X;
}

export function signingIntentHandler(
  fdc3Security: FDC3Security,
  handler: IntentHandler,
  intentName: string
): IntentHandler {
  const out = async (c: Context, m: ContextMetadataWithAuthenticity | undefined) => {
    async function wrapIntentResult(ir: IntentResult): Promise<IntentResult> {
      if (ir == undefined) {
        return;
      } else if (ir.type == 'app' || ir.type == 'user' || ir.type == 'private') {
        // it's a channel, just return as-is
        return ir;
      } else {
        // it's a context
        return signedContext(fdc3Security, ir as Context, intentName, null);
      }
    }

    async function applyHandler(context: Context, meta: ContextMetadata | undefined): Promise<IntentResult> {
      const result = await handler(context, meta);
      const wrapped = await wrapIntentResult(result);
      return wrapped;
    }

    const res = await checkSignature(fdc3Security, m, c, intentName, null);
    const res2 = applyHandler(res.context, res.meta);
    return res2;
  };

  return out;
}
