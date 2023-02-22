import { createRoot } from 'react-dom/client';
import { ReportHandler } from 'web-vitals';
import { App } from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);