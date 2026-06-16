import '../../static/styles.css';
import { getAgent } from '@finos/fdc3-get-agent';

/**
 * This demonstrates using the API via a promise
 */
getAgent().then(async fdc3 => {
  console.log('in promise');

  fdc3.addIntentListener('ViewNews', async context => {
    const msg = document.createElement('p');
    msg.textContent = `Received ViewNews intent, with context:\n${JSON.stringify(context, null, 2)}\n`;
    const log = document.getElementById('log');
    log?.appendChild(msg);

    return {
      type: 'fdc3.test',
      id: {
        from: 'app4',
        intent: 'ViewNews',
      },
    };
  });
});
