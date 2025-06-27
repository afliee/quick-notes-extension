import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createChromeMocks } from '../utils/debugMocks';

/**
 * Initialize the popup React application
 */
function initializeApp() {
  // Check if we're in debug mode (not a Chrome extension)
  const isDebugMode = !chrome?.runtime?.id;
  
  if (isDebugMode) {
    console.log('🛠️ Debug mode detected - initializing Chrome API mocks');
    createChromeMocks();
  }

  const container = document.getElementById('root') || document.getElementById('app');
  if (!container) {
    console.error('Root container not found');
    return;
  }

  const root = createRoot(container);
  root.render(<App />);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
} 