import { ContextHandler, ContextMetadata } from '@finos/fdc3-standard';
import { PrivateFDC3Security } from '../impl/PrivateFDC3Security';
import { Context } from '@finos/fdc3-context';
import { BrowserTypes } from '@finos/fdc3-schema';
import { PublicFDC3Security } from '../impl/PublicFDC3Security';
import { APP_METADATA_KEY } from '../delegates/AbstractChannelDelegate';

type DetachedSignature = BrowserTypes.DetachedSignature;
type AntiReplayClaims = BrowserTypes.AntiReplayClaims;

/**
 * Handles signing of contexts
 */
export async function signContext(
  fdc3Security: PrivateFDC3Security,
  context: Context,
  metadata?: ContextMetadata
): Promise<{ context: Context; metadata: ContextMetadata }> {
  const { signature, antiReplay } = await fdc3Security.sign(context);
  const metaOut = {
    ...metadata,
    signature,
    antiReplay,
  } as ContextMetadata;
  return { context, metadata: metaOut };
}

export async function checkSignature(
  fdc3Security: PublicFDC3Security,
  mIn: ContextMetadata | undefined,
  c: Context
): Promise<{ context: Context; metadata: ContextMetadata }> {
  const unsignedContext: Context = { ...c };
  let m: ContextMetadata;

  // extract metadata if using old
  if (c[APP_METADATA_KEY]) {
    m = {
      ...c[APP_METADATA_KEY],
    } as ContextMetadata;
    delete unsignedContext[APP_METADATA_KEY];
  } else {
    m = { ...mIn } as ContextMetadata;
  }

  if (m?.signature) {
    let signature: DetachedSignature = m.signature;
    let antiReplay: AntiReplayClaims = m.antiReplay!;
    const authenticity = await fdc3Security.verifySignature(signature, unsignedContext, antiReplay);
    return { context: unsignedContext, metadata: { ...m, authenticity } };
  } else {
    // not signed, return
    return { context: unsignedContext, metadata: { ...m, authenticity: { signed: false } } };
  }
}

export function signatureCheckingContextHandler(
  fdc3Security: PublicFDC3Security,
  handler: ContextHandler
): ContextHandler {
  return async (c: Context, m?: ContextMetadata) => {
    const res = await checkSignature(fdc3Security, m, c);
    handler(res.context, res.metadata);
  };
}

// TODO: Reinstate when we have the metadata for it.
// export function signingIntentHandler(
//   fdc3Security: PrivateFDC3Security,
//   handler: IntentHandler,
// ): IntentHandler {
//   return async (c: Context, m: DesktopAgentProvidableContextMetadata | undefined) => {
//     async function wrapIntentResult(ir: IntentResult): Promise<IntentResult> {
//       if (ir == undefined) {
//         return;
//       } else if (
//         typeof ir === 'object' &&
//         ('id' in ir || 'type' in ir) &&
//         !('type' in (ir as any) && ['user', 'app', 'private'].includes((ir as any).type))
//       ) {
//         // it's a context
//         return signContext(fdc3Security, ir as Context);
//       } else {
//         // it's a channel or other result
//         return ir;
//       }
//     }

//     const res = await checkSignature(fdc3Security, m, c);
//     const result = await handler(res.context, res.meta as any);
//     return await wrapIntentResult(result);
//   };
// }
