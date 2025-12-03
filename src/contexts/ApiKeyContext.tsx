import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string; // Hugging Face Token
  setApiKey: (key: string) => void;
  geminiKey: string; // Gemini API Key
  setGeminiKey: (key: string) => void;
  isConfigured: boolean; // HF Configured
  isGeminiConfigured: boolean; // Gemini Configured
  clearApiKey: () => void;
  clearGeminiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const HF_STORAGE_KEY = 'huggingface-api-token';
const GEMINI_STORAGE_KEY = 'gemini-api-key';

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  // Hugging Face Token State
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(HF_STORAGE_KEY);
        const envKey = import.meta.env?.VITE_HUGGINGFACE_API_TOKEN as string;
        return saved || envKey || '';
      }
      return (import.meta.env?.VITE_HUGGINGFACE_API_TOKEN as string) || '';
    } catch (e) {
      return (import.meta.env?.VITE_HUGGINGFACE_API_TOKEN as string) || '';
    }
  });

  // Gemini API Key State
  const [geminiKey, setGeminiKeyState] = useState<string>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(GEMINI_STORAGE_KEY);
        const envKey = import.meta.env?.VITE_GEMINI_API_KEY as string;
        return saved || envKey || '';
      }
      return (import.meta.env?.VITE_GEMINI_API_KEY as string) || '';
    } catch (e) {
      return (import.meta.env?.VITE_GEMINI_API_KEY as string) || '';
    }
  });

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    try {
      if (typeof localStorage !== 'undefined') {
        if (key) {
          localStorage.setItem(HF_STORAGE_KEY, key);
        } else {
          localStorage.removeItem(HF_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn('LocalStorage access denied');
    }
  }, []);

  const setGeminiKey = useCallback((key: string) => {
    setGeminiKeyState(key);
    try {
      if (typeof localStorage !== 'undefined') {
        if (key) {
          localStorage.setItem(GEMINI_STORAGE_KEY, key);
        } else {
          localStorage.removeItem(GEMINI_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn('LocalStorage access denied');
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKey('');
  }, [setApiKey]);

  const clearGeminiKey = useCallback(() => {
    setGeminiKey('');
  }, [setGeminiKey]);

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        setApiKey,
        geminiKey,
        setGeminiKey,
        isConfigured: apiKey.length > 0,
        isGeminiConfigured: geminiKey.length > 0,
        clearApiKey,
        clearGeminiKey,
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
