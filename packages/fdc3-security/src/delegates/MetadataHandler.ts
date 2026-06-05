import { Context } from '@finos/fdc3-context';
import {
  AppProvidableContextMetadata,
  compareVersionNumbers,
  ContextMetadata,
  DesktopAgent,
} from '@finos/fdc3-standard';

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

  constructor(metadataAvailable: boolean) {
    this.metadataAvailable = metadataAvailable;
  }

  private createMetadata(metadata?: { [key: string]: any }): AppProvidableContextMetadata {
    return {
      ...metadata,
    };
  }

  pack(context: Context, metadata?: { [key: string]: any }): { context: Context; metadata: ContextMetadata } {
    const fullMetadata = this.createMetadata(metadata) as ContextMetadata;
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
 * Builds a {@link MetadataHandler} from the FDC3 version string sent on the secure-boundary handshake
 * (same semver rule as {@link createMetadataHandler} after `getInfo().fdc3Version`).
 */
export function createMetadataHandlerWithFDC3Version(fdc3Version: string): MetadataHandler {
  const metadataAvailable: boolean = (compareVersionNumbers(fdc3Version, '3.0') ?? 0) >= 0;
  return new MetadataHandlerImpl(metadataAvailable);
}

/**
 * Builds a handler based on the FDC3 platform that we're on.
 * To use metadata, `fdc3Version` must be at least **3.0**.
 */
export async function createMetadataHandler(desktopAgent: DesktopAgent): Promise<MetadataHandler> {
  const info = await desktopAgent.getInfo();
  return createMetadataHandlerWithFDC3Version(info.fdc3Version);
}
