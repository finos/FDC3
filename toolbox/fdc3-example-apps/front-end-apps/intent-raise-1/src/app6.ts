import '../../static/styles.css';
import { getAgent } from '@finos/fdc3-get-agent';
import { Instrument } from '@finos/fdc3-context';

/**
 * This demonstrates using the API via a promise
 */
getAgent().then(async fdc3 => {
  console.log('in promise');
  const log = document.getElementById('log');
  const context: Instrument = {
    type: 'fdc3.instrument',
    id: {
      isin: 'Abc123',
    },
  };
  const resolution = await fdc3.raiseIntent('ViewQuote', context);

  log!.textContent = `Got resolution: ${JSON.stringify(resolution, null, 2)}\n\n`;
  const result = await resolution.getResult();
  const metadata = await resolution.getResultMetadata();
  log!.textContent += `Got result: ${JSON.stringify(result, null, 2)}\n\n`;
  log!.textContent += `Got metadata: ${JSON.stringify(metadata, null, 2)}\n\n`;
});
