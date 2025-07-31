import { ClientSideImplementation } from '@finos/fdc3';
import { Express } from 'express';

export function setupSecurityDemoEndpoints(app: Express) {
  // Used to demonstrate how encryption can be
  // safely performed on the back - end.

  const csi = new ClientSideImplementation();

  const sp1Signing = csi.createSigningKeys();
  const sp2Signing = csi.createSigningKeys();

  const sp1Wrapping = csi.createWrappingKeys();
  const sp2Wrapping = csi.createWrappingKeys();

  app.get('/sp1-public-key', async (_, res) => {
    const jwk1 = await crypto.subtle.exportKey('jwk', (await sp1Signing).publicKey);
    const jwk2 = await crypto.subtle.exportKey('jwk', (await sp1Wrapping).publicKey);
    res.send(JSON.stringify([jwk1, jwk2]));
  });

  app.get('/sp2-public-key', async (_, res) => {
    const jwk1 = await crypto.subtle.exportKey('jwk', (await sp2Signing).publicKey);
    const jwk2 = await crypto.subtle.exportKey('jwk', (await sp2Wrapping).publicKey);
    res.send(JSON.stringify([jwk1, jwk2]));
  });

  app.get('/sp1-private-key', async (_, res) => {
    const jwk1 = await crypto.subtle.exportKey('jwk', (await sp1Signing).privateKey);
    const jwk2 = await crypto.subtle.exportKey('jwk', (await sp1Wrapping).privateKey);
    res.send(JSON.stringify([jwk1, jwk2]));
  });

  app.get('/sp2-private-key', async (_, res) => {
    const jwk1 = await crypto.subtle.exportKey('jwk', (await sp2Signing).privateKey);
    const jwk2 = await crypto.subtle.exportKey('jwk', (await sp2Wrapping).privateKey);
    res.send(JSON.stringify([jwk1, jwk2]));
  });
}
