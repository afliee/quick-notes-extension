/**
 * Background service worker for Quick Notes Extension
 */

interface ErrorLogMessage {
  type: 'LOG_ERROR';
  error: string;
  stack?: string;
  errorInfo?: any;
  action?: string;
  noteId?: string;
  timestamp?: number;
}

interface Message {
  type: string;
  [key: string]: any;
}

// Extension installation handler
chrome.runtime.onInstalled.addListener((details) => {
  const version = chrome.runtime.getManifest().version;
  
  if (details.reason === 'install') {
    console.log(`Quick Notes Extension v${version} installed`);
    
    // Set default settings or perform initial setup
    chrome.storage.local.set({
      'quickNotes_settings': {
        version,
        installedAt: Date.now(),
        theme: 'light'
      }
    }).catch(console.error);
    
  } else if (details.reason === 'update') {
    console.log(`Quick Notes Extension updated to v${version}`);
    
    // Handle migration if needed
    handleVersionUpdate(details.previousVersion, version);
  }
});

// Handle version updates and migrations
async function handleVersionUpdate(previousVersion?: string, currentVersion?: string) {
  try {
    console.log(`Updating from ${previousVersion} to ${currentVersion}`);
    
    // Example migration logic
    if (previousVersion && compareVersions(previousVersion, '1.0.0') < 0) {
      // Migrate data from old format if needed
      console.log('Performing migration for version 1.0.0');
    }
    
    // Update settings with new version
    const settings = await chrome.storage.local.get('quickNotes_settings');
    await chrome.storage.local.set({
      'quickNotes_settings': {
        ...settings.quickNotes_settings,
        version: currentVersion,
        updatedAt: Date.now()
      }
    });
    
  } catch (error) {
    console.error('Failed to handle version update:', error);
  }
}

// Simple version comparison utility
function compareVersions(version1: string, version2: string): number {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    
    if (v1part < v2part) return -1;
    if (v1part > v2part) return 1;
  }
  
  return 0;
}

// Enhanced message handler for communication with popup/content scripts
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  switch (message.type) {
    case 'LOG_ERROR':
      handleErrorLog(message as ErrorLogMessage);
      break;
      
    case 'GET_EXTENSION_INFO':
      sendResponse({
        version: chrome.runtime.getManifest().version,
        name: chrome.runtime.getManifest().name
      });
      break;
    
    default:
      console.log('Unknown message type:', message.type, message);
  }
  
  // Return true to keep message channel open for async responses
  return true;
});

// Enhanced error logging
function handleErrorLog(message: ErrorLogMessage) {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    error: message.error,
    stack: message.stack,
    action: message.action,
    noteId: message.noteId,
    userAgent: navigator.userAgent,
    url: chrome.runtime.getURL('')
  };
  
  console.error('Extension Error Log:', errorInfo);
  
  // Store error for debugging (with size limits)
  chrome.storage.local.get('quickNotes_errorLog').then(result => {
    const errorLog = result.quickNotes_errorLog || [];
    errorLog.push(errorInfo);
    
    // Keep only last 50 errors to prevent storage bloat
    const trimmedLog = errorLog.slice(-50);
    
    chrome.storage.local.set({
      'quickNotes_errorLog': trimmedLog
    });
  }).catch(console.error);
}

// Cleanup old data periodically
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    performCleanup();
  }
});

// Set up periodic cleanup (every 24 hours)
chrome.alarms.create('cleanup', {
  delayInMinutes: 1440, // 24 hours
  periodInMinutes: 1440
});

async function performCleanup() {
  try {
    // Clean old error logs (older than 7 days)
    const result = await chrome.storage.local.get('quickNotes_errorLog');
    const errorLog = result.quickNotes_errorLog || [];
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const recentErrors = errorLog.filter((error: any) => 
      new Date(error.timestamp).getTime() > weekAgo
    );
    
    if (recentErrors.length !== errorLog.length) {
      await chrome.storage.local.set({
        'quickNotes_errorLog': recentErrors
      });
      console.log(`Cleaned up ${errorLog.length - recentErrors.length} old error logs`);
    }
  } catch (error) {
    console.error('Failed to perform cleanup:', error);
  }
} 