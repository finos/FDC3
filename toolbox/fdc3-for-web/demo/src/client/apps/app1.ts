import { getAgent } from '@finos/fdc3';

function createContext(i: number) {
  return {
    type: 'demo.counter',
    count: i,
  };
}

/**
 * Calling this function should get the fdc3 DesktopAgent and then
 * broadcast 50 context elements to the default channel.
 *
 * Can be called any number of times.
 */
async function startBroadcasting() {
  console.log('starting...');
  const fdc3 = await getAgent();
  console.log('got api...');
  const cc = await fdc3.getCurrentChannel();

  if (cc == null) {
    const channels = await fdc3.getUserChannels();
    await fdc3.joinUserChannel(channels[0].id);
  }
  for (let index = 0; index < 50; index++) {
    setTimeout(() => fdc3.broadcast(createContext(index)), index * 1000);
  }
}

window.addEventListener('load', () => {
  const broadcast = document.getElementById('broadcast');
  broadcast?.addEventListener('click', () => startBroadcasting());
});
