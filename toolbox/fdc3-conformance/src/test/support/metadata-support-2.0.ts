import { expect } from 'chai';
import {
  IntentResolution,
  AppIdentifier,
  AppMetadata,
  Channel,
  Context,
  ContextMetadata,
  DesktopAgent,
  ImplementationMetadata,
} from '@finos/fdc3';
import constants from '../../constants';
import { APIDocumentation2_0 } from '../support/apiDocuments-2.0';

const getMetadataDocs = '\r\nDocumentation: ' + APIDocumentation2_0.appMetadata + '\r\nCause: ';
const getInfoDocs = '\r\nDocumentation: ' + APIDocumentation2_0.getInfo + '\r\nCause';
declare let fdc3: DesktopAgent;
const validAppMetaDataProperties = [
  'appId',
  'instanceId',
  'name',
  'version',
  'instanceMetadata',
  'title',
  'tooltip',
  'description',
  'icons',
  'screenshots',
  'resultType',
];
export class MetadataValidator {
  validateAppMetadata(metadata: AppMetadata) {
    expect(metadata, `The AppMetadata object does not contain an appId property${getMetadataDocs}`).to.have.property(
      'appId'
    );
    const properties = Object.keys(metadata);
    for (const property of properties) {
      expect(
        validAppMetaDataProperties,
        `The AppMetadata object contains an invalid property ${getMetadataDocs}`
      ).includes(property);
    }
  }

  validateImplementationMetadata(implMetadata: ImplementationMetadata) {
    expect(implMetadata, `ImplementationMetadata did not have property fdc3Version${getInfoDocs}`).to.have.property(
      'fdc3Version'
    );
    expect(parseFloat(implMetadata.fdc3Version)).to.be.greaterThanOrEqual(2);
    expect(implMetadata, `ImplementationMetadata did not have property provider${getInfoDocs}`).to.have.property(
      'provider'
    );
    expect(implMetadata.provider).to.not.be.equal('');
    expect(
      implMetadata.optionalFeatures,
      `ImplementationMetadata.optionalFeatures did not have property OriginatingAppMetadata${getInfoDocs}`
    ).to.have.property('OriginatingAppMetadata');
    expect(
      implMetadata.optionalFeatures,
      `ImplementationMetadata.optionalFeatures did not have property UserChannelMembershipAPIs${getInfoDocs}`
    ).to.have.property('UserChannelMembershipAPIs');
    expect(
      typeof implMetadata.optionalFeatures.OriginatingAppMetadata,
      `ImplementationMetadata.optionalFeatures.OriginatingAppMetadata should be of type boolean`
    ).to.be.equal('boolean');
    expect(
      typeof implMetadata.optionalFeatures.UserChannelMembershipAPIs,
      'ImplementationMetadata.optionalFeatures.UserChannelMembershipAPIs should be of type boolean'
    ).to.be.equal('boolean');
  }

  validateAppIdentifier(appIdentifier: AppIdentifier) {
    expect(appIdentifier, `AppIdentifier did not have property appId${getInfoDocs}`).to.have.property('appId');
    expect(typeof appIdentifier.appId).to.be.equal('string');
    expect(appIdentifier, `AppIdentifier did not have property instanceId${getInfoDocs}`).to.have.property(
      'instanceId'
    );
    expect(typeof appIdentifier.instanceId).to.be.equal('string');
  }
}

export class MetadataFdc3Api {
  async openMetadataApp(contextType?: string): Promise<AppIdentifier> {
    if (contextType) {
      return await fdc3.open(
        {
          appId: 'MetadataAppId',
        },
        { type: contextType }
      );
    } else {
      return await fdc3.open({
        appId: 'MetadataAppId',
      });
    }
  }

  async getAppInstances(): Promise<AppIdentifier[]> {
    return await fdc3.findInstances({ appId: 'MetadataAppId' });
  }

  async getAppMetadata(appIdentifier?: AppIdentifier): Promise<AppMetadata> {
    if (!appIdentifier) {
      appIdentifier = {
        appId: 'MetadataAppId',
      };
    }

    return await fdc3.getAppMetadata(appIdentifier);
  }

  async retrieveAppControlChannel(): Promise<Channel> {
    return await fdc3.getOrCreateChannel(constants.ControlChannel);
  }

  async raiseIntent(intent: string, contextType: string, appIdentifier: AppIdentifier): Promise<IntentResolution> {
    return await fdc3.raiseIntent(intent, { type: contextType }, appIdentifier);
  }

  async getInfo(): Promise<ImplementationMetadata> {
    return await fdc3.getInfo();
  }
}

export interface MetadataContext extends Context {
  implMetadata?: ImplementationMetadata;
  contextMetadata?: ContextMetadata;
}
