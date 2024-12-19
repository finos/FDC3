import { getAgent } from '@kite9/fdc3-get-agent';

/**
 * This demonstrates using the API via a promise
 */
getAgent().then(async fdc3 => {
  console.log('in promise');
  const log = document.getElementById('log');
  const msg = document.createElement('p');
  const info = await fdc3.getInfo();
  msg.textContent = 'FDC3 Loaded: ' + JSON.stringify(info);
  log?.appendChild(msg);

  const cc = await fdc3.getCurrentChannel();
  if (cc == null) {
    const channels = await fdc3.getUserChannels();
    await fdc3.joinUserChannel(channels[0].id);
  }

  fdc3.addContextListener(null, context => {
    const msg = document.createElement('p');
    msg.textContent = 'Received: ' + JSON.stringify(context);
    log?.appendChild(msg);
  });
});
