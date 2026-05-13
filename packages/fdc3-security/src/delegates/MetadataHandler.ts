import { AppIdentifier, Context } from '@finos/fdc3-context';
import { ContextMetadata, DesktopAgent, versionIsAtLeast } from '@finos/fdc3-standard';

/**
 * Older versions of FDC3 (< 3.0) did not allow metadata to be broadcast with a context.
 * This interface provides a way to pack and unpack metadata in those cases by placing metadata
 * into an __appMeta property on the context.
 */
export interface MetadataHandler {
  /**
   * Packs metadata in context when required.  It's possible to only pass in a few of the properties of the
   * metadata and the remaining ones will be created automatically.
   */
  pack(context: Context, metadata?: { [key: string]: any }): { context: Context; metadata: ContextMetadata };

  /**
   * Unpacks metadata from context when required.
   */
  unpack(context: Context, metadata?: ContextMetadata): { context: Context; metadata: ContextMetadata };
}

export class MetadataHandlerImpl implements MetadataHandler {
  protected metadataAvailable: boolean;
  private source: AppIdentifier;

  constructor(metadataAvailable: boolean, source: AppIdentifier) {
    this.metadataAvailable = metadataAvailable;
    this.source = source;
  }

  private createMetadata(metadata?: { [key: string]: any }): ContextMetadata {
    return {
      timestamp: new Date(),
      source: this.source,
      ...metadata,
    };
  }

  pack(context: Context, metadata?: { [key: string]: any }): { context: Context; metadata: ContextMetadata } {
    const fullMetadata = this.createMetadata(metadata);
    if (this.metadataAvailable) {
      return { context, metadata: fullMetadata };
    } else {
      return { context: { ...context, __appMeta: fullMetadata }, metadata: fullMetadata };
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

/**
 * Builds a handler based on the FDC3 platform that we're on.
 * To use metadata, `fdc3Version` must be at least **3.0**.
 */
export async function createMetadataHandler(desktopAgent: DesktopAgent): Promise<MetadataHandler> {
  const info = await desktopAgent.getInfo();
  const metadataAvailable = versionIsAtLeast(info, '3.0') === true;
  return new MetadataHandlerImpl(metadataAvailable, info.appMetadata);
}
