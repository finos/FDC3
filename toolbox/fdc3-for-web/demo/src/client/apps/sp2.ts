import {
  IntentResolution,
  PrivateChannel,
  SecuredDesktopAgent,
  Resolver,
  SIGNING_ALGORITHM_DETAILS,
  ClientSideImplementation,
  WRAPPING_ALGORITHM_KEY_PARAMS,
  getAgent,
} from '@finos/fdc3';

let signingPrivateKey: CryptoKey | null = null;
let unwrappingPrivateKey: CryptoKey | null = null;
let privateChannel: PrivateChannel | null = null;
let sfdc3: SecuredDesktopAgent | null = null;

async function setupKeys(j: JsonWebKey[]): Promise<void> {
  signingPrivateKey = await crypto.subtle.importKey('jwk', j[0], SIGNING_ALGORITHM_DETAILS, true, ['sign']);
  unwrappingPrivateKey = await crypto.subtle.importKey('jwk', j[1], WRAPPING_ALGORITHM_KEY_PARAMS, true, ['unwrapKey']);
}

getAgent().then(() => {
  console.log('FDC3 is ready');
});

/**
 * Gets the private channel via a raise Intent then spools the output
 */
async function doIt() {
  fetch('/sp2-private-key')
    .then(r => r.json())
    .then(j => setupKeys(j))
    .then(c => {
      const csi = new ClientSideImplementation();

      const resolver: Resolver = (u: string) => {
        return fetch(u).then(r => r.json());
      };

      sfdc3 = new SecuredDesktopAgent(
        window.fdc3,
        csi.initSigner(signingPrivateKey as CryptoKey, '/sp2-public-key'),
        csi.initUnwrapKey(unwrappingPrivateKey as CryptoKey, '/sp2-public-key'),
        resolver
      );

      const log = document.getElementById('log');
      sfdc3
        .raiseIntent('SecretComms', {
          type: 'fdc3.instrument',
          id: {
            isin: 'Abc123',
          },
        })
        .then((reso: IntentResolution) => {
          log!!.textContent = `Got resolution: ${reso.intent} from ${reso.source}\n`;

          reso.getResult().then(result => {
            log!!.textContent += `Got result: ${result?.type} ${result?.id}\n`;
            privateChannel = result as PrivateChannel;
            privateChannel.addContextListener('demo.counter', (ctx, meta) => {
              log!!.textContent += `Private Channel Message ctx=${JSON.stringify(ctx)} meta=${JSON.stringify(meta)} \n`;
            });
          });
        });
    });
}

window.addEventListener('load', () => {
  const broadcast = document.getElementById('raise');
  broadcast?.addEventListener('click', () => doIt());
});
