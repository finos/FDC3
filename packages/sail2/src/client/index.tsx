import { Frame } from "./frame/frame"
import { createRoot } from 'react-dom/client';
import { CLIENT_STATE } from "./state/state";
import '../../static/fonts/DM_Sans/DM_Sans.css'

const container = document.getElementById('app');
const root = createRoot(container!);
const cs = CLIENT_STATE
root.render(<Frame cs={cs} />);