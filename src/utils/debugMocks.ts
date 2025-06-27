/**
 * Mock Chrome APIs for debugging in localhost
 * This allows testing the extension without loading it into Chrome
 */

const DEBUG_PREFIX = 'debug_extension_';

export const createChromeMocks = () => {
  if (typeof chrome !== 'undefined') {
    // Chrome APIs already exist, don't mock
    return;
  }

  // Mock chrome.storage.local with localStorage persistence
  const mockStorage = {
    get: async (keys: string | string[] | Record<string, any> | null): Promise<Record<string, any>> => {
      console.log('🔍 Mock chrome.storage.local.get:', keys);
      
      const result: Record<string, any> = {};
      
      if (keys === null || keys === undefined) {
        // Get all items
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(DEBUG_PREFIX)) {
            const actualKey = key.slice(DEBUG_PREFIX.length);
            try {
              const value = localStorage.getItem(key);
              result[actualKey] = value ? JSON.parse(value) : null;
            } catch {
              result[actualKey] = localStorage.getItem(key);
            }
          }
        }
      } else if (typeof keys === 'string') {
        // Single key
        const value = localStorage.getItem(DEBUG_PREFIX + keys);
        if (value !== null) {
          try {
            result[keys] = JSON.parse(value);
          } catch {
            result[keys] = value;
          }
        }
      } else if (Array.isArray(keys)) {
        // Array of keys
        keys.forEach(key => {
          const value = localStorage.getItem(DEBUG_PREFIX + key);
          if (value !== null) {
            try {
              result[key] = JSON.parse(value);
            } catch {
              result[key] = value;
            }
          }
        });
      } else if (typeof keys === 'object' && keys !== null) {
        // Object with default values
        Object.keys(keys).forEach(key => {
          const value = localStorage.getItem(DEBUG_PREFIX + key);
          if (value !== null) {
            try {
              result[key] = JSON.parse(value);
            } catch {
              result[key] = value;
            }
          } else {
            result[key] = keys[key];
          }
        });
      }
      
      console.log('📤 Mock storage result:', result);
      return Promise.resolve(result);
    },

    set: async (items: Record<string, any>): Promise<void> => {
      console.log('💾 Mock chrome.storage.local.set:', items);
      
      Object.entries(items).forEach(([key, value]) => {
        try {
          localStorage.setItem(DEBUG_PREFIX + key, JSON.stringify(value));
        } catch {
          localStorage.setItem(DEBUG_PREFIX + key, String(value));
        }
      });
      
      return Promise.resolve();
    },

    remove: async (keys: string | string[]): Promise<void> => {
      console.log('🗑️ Mock chrome.storage.local.remove:', keys);
      
      const keysArray = Array.isArray(keys) ? keys : [keys];
      keysArray.forEach(key => {
        localStorage.removeItem(DEBUG_PREFIX + key);
      });
      
      return Promise.resolve();
    },

    clear: async (): Promise<void> => {
      console.log('🧹 Mock chrome.storage.local.clear');
      
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(DEBUG_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return Promise.resolve();
    }
  };

  // Mock chrome.identity
  const mockIdentity = {
    getRedirectURL: (): string => {
      const url = 'https://debug-extension.chromiumapp.org/';
      console.log('🔗 Mock chrome.identity.getRedirectURL:', url);
      return url;
    },

    launchWebAuthFlow: async (options: { url: string; interactive: boolean }): Promise<string> => {
      console.log('🚀 Mock chrome.identity.launchWebAuthFlow:', options);
      
      // For debugging, you can customize this behavior
      if (options.url.includes('oauth/authorize')) {
        // Simulate different scenarios for testing
        const scenario = localStorage.getItem(DEBUG_PREFIX + 'oauth_scenario') || 'success';
        
        switch (scenario) {
          case 'success':
            // Simulate successful OAuth flow
            const mockToken = 'mock_access_token_' + Date.now();
            const redirectUrl = `${mockIdentity.getRedirectURL()}#access_token=${mockToken}&expires_in=3600&token_type=Bearer`;
            console.log('✅ Mock OAuth success:', redirectUrl);
            return redirectUrl;
          
          case 'cancel':
            throw new Error('The user did not approve access.');
          
          case 'error':
            throw new Error('Authorization page could not be loaded.');
          
          default:
            throw new Error('Mock: OAuth flow failed');
        }
      }
      
      throw new Error('Mock: Unsupported auth flow');
    },

    removeCachedAuthToken: async (options: { token: string }): Promise<void> => {
      console.log('🚮 Mock chrome.identity.removeCachedAuthToken:', options);
      return Promise.resolve();
    }
  };

  // Create the mock chrome object
  (window as any).chrome = {
    storage: {
      local: mockStorage
    },
    identity: mockIdentity
  };

  // Also create browser alias
  (window as any).browser = (window as any).chrome;
  
  console.log('🎭 Chrome API mocks initialized for debugging');
};

// Debug helpers
export const debugHelpers = {
  // Set OAuth scenario for testing
  setOAuthScenario: (scenario: 'success' | 'cancel' | 'error') => {
    localStorage.setItem(DEBUG_PREFIX + 'oauth_scenario', scenario);
    console.log('🎭 OAuth scenario set to:', scenario);
  },

  // Clear all debug data
  clearDebugData: () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(DEBUG_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('🧹 All debug data cleared');
  },

  // View all stored data
  viewDebugData: () => {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(DEBUG_PREFIX)) {
        const actualKey = key.slice(DEBUG_PREFIX.length);
        try {
          data[actualKey] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          data[actualKey] = localStorage.getItem(key);
        }
      }
    }
    console.log('📊 Debug data:', data);
    return data;
  }
};

// Expose debug helpers globally for console access
(window as any).debugHelpers = debugHelpers;

import { Note } from '../types';

/**
 * Debug utilities for local development
 */

/**
 * Mock notes for testing
 */
export const mockNotes: Note[] = [
  {
    id: 'mock-1',
    content: 'This is a sample note for testing. You can edit or delete it.',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'mock-2', 
    content: 'Another test note with multiple lines.\nThis demonstrates how line breaks work.\nYou can use Cmd/Ctrl+Enter to save notes quickly.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'mock-3',
    content: 'A shorter note.',
    createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago  
    updatedAt: Date.now() - 1000 * 60 * 30,
  }
];

/**
 * Load mock notes into storage for development
 */
export const loadMockNotes = async (): Promise<void> => {
  try {
    await chrome.storage.local.set({ quickNotes: mockNotes });
    console.log('Mock notes loaded successfully');
  } catch (error) {
    console.error('Failed to load mock notes:', error);
  }
};

/**
 * Check if we're in development mode
 */
export const isDevelopment = (): boolean => {
  return !chrome.runtime.getManifest().key; // Extensions in development don't have a key
}; 