import { expect } from 'chai';
import { ContextMetadata } from '@finos/fdc3';
import { AntiReplayClaims, DetachedSignature } from '@finos/fdc3-schema/generated/api/BrowserTypes';

const metadataDocs = '\r\nDocumentation: https://fdc3.finos.org/docs/api/ref/Metadata#contextmetadata\r\nCause: ';

export class ContextMetadataValidator {
  validateRequiredFields(metadata: ContextMetadata, sourceAppId?: string) {
    expect(metadata, `ContextMetadata was not provided${metadataDocs}`).not.to.be.undefined;
    expect(metadata, `ContextMetadata did not have property source${metadataDocs}`).to.have.property('source');
    expect(metadata.source, `ContextMetadata.source did not have property appId${metadataDocs}`).to.have.property(
      'appId'
    );
    expect(typeof metadata.source.appId, `ContextMetadata.source.appId should be a string`).to.be.equal('string');
    if (sourceAppId) {
      expect(
        metadata.source.appId.split('@')[0],
        `ContextMetadata.source.appId did not match expected app${metadataDocs}`
      ).to.be.equal(sourceAppId.split('@')[0]);
    }
    expect(metadata, `ContextMetadata did not have property timestamp${metadataDocs}`).to.have.property('timestamp');
  }

  validateTraceId(metadata: ContextMetadata, expectedTraceId: string) {
    expect(metadata, `ContextMetadata did not have property traceId${metadataDocs}`).to.have.property('traceId');
    expect(metadata.traceId, `ContextMetadata.traceId did not match expected value`).to.be.equal(expectedTraceId);
  }

  validateSignature(metadata: ContextMetadata, expectedSignature: DetachedSignature) {
    expect(metadata, `ContextMetadata did not have property signature${metadataDocs}`).to.have.property('signature');
    expect(metadata.signature, `ContextMetadata.signature did not match expected value`).to.be.deep.equal(
      expectedSignature
    );
  }

  validateAntiReplay(metadata: ContextMetadata, expectedAntiReplay: AntiReplayClaims) {
    expect(metadata, `ContextMetadata did not have property antiReplay${metadataDocs}`).to.have.property('antiReplay');
    expect(metadata.antiReplay, `ContextMetadata.antiReplay did not match expected value`).to.be.deep.equal(
      expectedAntiReplay
    );
  }

  validateCustom(metadata: ContextMetadata, expectedKey: string, expectedValue: unknown) {
    expect(metadata, `ContextMetadata did not have property custom${metadataDocs}`).to.have.property('custom');
    expect(metadata.custom, `ContextMetadata.custom did not have property ${expectedKey}`).to.have.property(
      expectedKey
    );
    expect(
      metadata.custom![expectedKey],
      `ContextMetadata.custom.${expectedKey} did not match expected value`
    ).to.be.equal(expectedValue);
  }
}

export interface ContextMetadataResult {
  source?: { appId?: string; instanceId?: string };
  timestamp?: string;
  traceId?: string;
  signature?: DetachedSignature;
  antiReplay?: AntiReplayClaims;
  custom?: Record<string, unknown>;
}

export interface ContextMetadataControlContext {
  type: string;
  testId?: string;
  contextMetadata?: ContextMetadataResult;
  errorMessage?: string;
}
