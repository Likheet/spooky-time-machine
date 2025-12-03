import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isConfigured: boolean;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const STORAGE_KEY = 'huggingface-api-token';

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      // Check localStorage for saved API key
      const saved = localStorage.getItem(STORAGE_KEY);
      // Also check environment variable as fallback
      const envKey = import.meta.env?.VITE_HUGGINGFACE_API_TOKEN as string;
      return saved || envKey || '';
    } catch (e) {
      console.warn('LocalStorage access denied, using in-memory storage only');
      return (import.meta.env?.VITE_HUGGINGFACE_API_TOKEN as string) || '';
    }
  });

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    try {
      if (key) {
        localStorage.setItem(STORAGE_KEY, key);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('LocalStorage access denied, key will not be persisted');
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore error
    }
  }, []);

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        setApiKey,
        isConfigured: apiKey.length > 0,
        clearApiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}
