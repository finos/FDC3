import '../../static/styles.css';
import { getAgent } from '@finos/fdc3';
import { createRoot } from 'react-dom/client';
import TradingViewWidget from './TradingViewWidget';

const container = document.getElementById('app');
const root = createRoot(container!);

function getQueryParameterMode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode') ?? 'chart';
}

root.render(<TradingViewWidget mode={getQueryParameterMode()} />);

// Populate title and subtitle from the app's directory record via getInfo()
getAgent().then(async fdc3 => {
  const { appMetadata } = await fdc3.getInfo();
  const titleEl = document.querySelector('.app-title');
  const subtitleEl = document.querySelector('.app-subtitle');
  if (titleEl && appMetadata.title) titleEl.textContent = appMetadata.title;
  if (subtitleEl && appMetadata.description) subtitleEl.textContent = appMetadata.description;
});
