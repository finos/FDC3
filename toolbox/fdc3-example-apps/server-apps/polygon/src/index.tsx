import { createRoot } from 'react-dom/client';
import { PolygonWidget } from './PolygonWidget';

const container = document.getElementById('app');
const root = createRoot(container!);

function getQueryParameterMode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode') ?? 'news';
}

root.render(<PolygonWidget mode={getQueryParameterMode()} />);
