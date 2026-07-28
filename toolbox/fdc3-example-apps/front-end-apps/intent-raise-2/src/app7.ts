import '../../static/styles.css';
import { Instrument } from '@finos/fdc3-context';
import { getAgent } from '@finos/fdc3-get-agent';

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
  const resolution = await fdc3.raiseIntent('ViewNews', context);

  if (log) {
    log.textContent = `Got resolution: ${JSON.stringify(resolution, null, 2)}\n\n`;
    const result = await resolution.getResult();
    log.textContent += `Got result: ${JSON.stringify(result, null, 2)}\n\n`;
    const metadata = await resolution.getResultMetadata();
    log.textContent += `Got metadata: ${JSON.stringify(metadata, null, 2)}\n\n`;
  } else {
    console.error("Unable to load resolution as the log element didn't exist!");
  }
});
