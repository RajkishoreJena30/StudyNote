import { createRoot } from 'react-dom/client';
import AuthApp from './AuthApp';

// Standalone dev preview only (http://localhost:3003). When the shell loads
// this remote it imports AuthApp directly and this file never runs.
const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<AuthApp />);
}
