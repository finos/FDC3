import { getAgent } from '@kite9/fdc3-get-agent';

const init = async () => {
  const fdc3 = await getAgent();
  console.log('get fdc3', fdc3);

  const cc = await fdc3.getCurrentChannel();

  if (cc == null) {
    const channels = await fdc3.getUserChannels();
    await fdc3.joinUserChannel(channels[0].id);
  }

  const stx: any = (window as any).stxx;

  // If the user changes the symbol, broadcast the new symbol
  stx.callbacks.symbolChange = () => {
    const ticker = stx.chart.symbol;
    fdc3.broadcast({
      type: 'fdc3.instrument',
      name: ticker,
      id: { ticker },
    });
  };

  // Listen for changes to fdc3.instrument, and update the symbol
  fdc3.addContextListener('fdc3.instrument', context => {
    if (context.id?.ticker !== stx.chart.symbol) {
      stx.newChart(context.id?.ticker);
    }
  });

  // Listen for ViewChart events
  fdc3.addIntentListener('ViewChart', context => {
    stx.newChart(context.id?.ticker);
  });
};

window.addEventListener('load', init);
