import { DesktopAgent } from '@finos/fdc3-standard';
import { Sign } from './signing/SigningSupport';
import { UnwrapKey } from './encryption/EncryptionSupport';
import { UnopinionatedDesktopAgent } from './delegates/UnopinionatedDesktopAgent';
import { ClientSideImplementation, Resolver } from './ClientSideImplementation';

/**
 * This is intended to be the entry point for setting up the SecuredDesktopAgent,
 * which enforces the use of some of the ClientSideImplementation's functions.
 */
export class SecuredDesktopAgent extends UnopinionatedDesktopAgent {
  /**
   * Construct the secured desktop agent decorator.
   * sign and unwrap key are left for the user to provide, as they may want to perform
   * private-key based operations on the server side rather than the client side.
   *
   * @param d Original platform desktop agent instance (perhaps provided by window.fdc3)
   * @param sign A function that signs a message using a private key.  Can be do
   * @param resolver A function that allows the agent to resolve a public key URL into a public key (JsonWebKey[])
   * @param unwrapKey A function used to unwrap a symmetric key encrypted with a public key
   */
  constructor(d: DesktopAgent, sign: Sign, unwrapKey: UnwrapKey, resolver: Resolver) {
    const csi = new ClientSideImplementation();
    super(d, sign, csi.initChecker(resolver), csi.initWrapKey(resolver), unwrapKey);
  }
}
