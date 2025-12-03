import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ApiKeyProvider } from './contexts/ApiKeyContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityProvider>
      <ApiKeyProvider>
        <App />
      </ApiKeyProvider>
    </AccessibilityProvider>
  </StrictMode>
);
