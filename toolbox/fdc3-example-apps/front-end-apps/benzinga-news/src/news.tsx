import { createRoot } from 'react-dom/client';
import { Widget } from './Widget';

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<Widget />);
