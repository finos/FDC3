import { Context } from '@finos/fdc3-context';
import { ContextMetadata } from '@finos/fdc3-standard';

/**
 * Older versions of FDC3 (< 3.0) did not allow metadata to be broadcast with a context.
 * This interface provides a way to pack and unpack metadata in those cases by placing metadata
 * into an __appMeta property on the context.
 */
export interface MetadataHandler {
  /**
   * Packs metadata in context when required.
   */
  pack(context: Context, metadata?: ContextMetadata): { context: Context; metadata: ContextMetadata };

  /**
   * Unpacks metadata from context when required.
   */
  unpack(context: Context, metadata?: ContextMetadata): { context: Context; metadata: ContextMetadata };
}

export class MetadataHandlerImpl implements MetadataHandler {
  private metadataAvailable: boolean;

  constructor(metadataAvailable: boolean) {
    this.metadataAvailable = metadataAvailable;
  }

  pack(context: Context, metadata: ContextMetadata): { context: Context; metadata: ContextMetadata } {
    if (this.metadataAvailable) {
      return { context, metadata };
    } else {
      return { context: { ...context, __appMeta: metadata }, metadata: {} };
    }
  }

  unpack(context: Context, metadata: ContextMetadata): { context: Context; metadata: ContextMetadata } {
    if (context.__appMeta) {
      const outContext = { ...context };
      delete outContext.__appMeta;
      return {
        context: outContext,
        metadata: {
          ...metadata,
          ...context.__appMeta,
        },
      };
    } else {
      return { context, metadata };
    }
  }
}
