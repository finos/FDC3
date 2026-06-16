import '../../static/styles.css';
import { createRoot } from 'react-dom/client';
import TradingViewWidget from './TradingViewWidget';

const container = document.getElementById('app');
const root = createRoot(container!);

function getQueryParameterMode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode') ?? 'chart';
}

root.render(<TradingViewWidget mode={getQueryParameterMode()} />);
