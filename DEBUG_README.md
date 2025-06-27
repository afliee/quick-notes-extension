# 🛠️ Debug Mode Guide

This guide shows you how to test the Quick Notes extension in your browser without loading it into Chrome.

## 🚀 Quick Start

### Option 1: One-Command Debug
```bash
npm run debug
```
This will:
1. Build the extension
2. Start a local server on port 3000
3. Open the debug page in your browser

### Option 2: Manual Steps
```bash
# Build the extension
npm run build

# Start local server
python3 -m http.server 3000

# Open in browser
open http://localhost:3000/debug.html
```

## 🎯 What You Get

### ✅ Full Extension Experience
- Complete UI with header and settings page
- All components working as in Chrome
- Real-time state management
- Visual feedback and animations

### ✅ Persistent Storage
- Notes are saved to localStorage
- Settings persist between sessions
- Client ID configuration saved
- All data survives browser refresh

### ✅ Mock Chrome APIs
- `chrome.storage.local` → localStorage
- `chrome.identity` → configurable OAuth simulation
- Console logging for all API calls
- Debug helpers for testing scenarios

## 🔧 Debug Console Commands

Open browser console and use these commands:

### View Data
```javascript
// See all stored extension data
debugHelpers.viewDebugData()

// Clear all debug data
debugHelpers.clearDebugData()
```

### Test OAuth Scenarios
```javascript
// Test successful OAuth flow
debugHelpers.setOAuthScenario('success')

// Test user cancellation
debugHelpers.setOAuthScenario('cancel')

// Test OAuth error
debugHelpers.setOAuthScenario('error')
```

## 🧪 Testing Workflows

### 1. Basic Note Taking
1. Open debug page
2. Add notes in the main interface
3. Refresh page - notes should persist
4. Test search functionality

### 2. Settings Page
1. Click the ⚙️ settings button
2. Test collapsible instruction sections
3. Enter a mock Client ID (any valid format)
4. Save and verify persistence
5. Use back button to return to notes

### 3. Google OAuth Flow
1. Configure OAuth scenario: `debugHelpers.setOAuthScenario('success')`
2. Enter valid Client ID in settings
3. Click "Connect Google"
4. Watch console for OAuth simulation
5. Test different scenarios (cancel, error)

### 4. Full Integration Test
1. Add several notes
2. Configure Google OAuth
3. Try to sync notes (will be mocked)
4. Test error handling
5. Clear data and start over

## 📊 Debug Output

Watch the browser console for detailed logs:

```
🛠️ Debug mode detected - initializing Chrome API mocks
🎭 Chrome API mocks initialized for debugging
🔍 Mock chrome.storage.local.get: googleClientId
📤 Mock storage result: {}
💾 Mock chrome.storage.local.set: {googleClientId: "123..."}
🚀 Mock chrome.identity.launchWebAuthFlow: {url: "https://...", interactive: true}
✅ Mock OAuth success: https://debug-extension.chromiumapp.org/#access_token=...
```

## 🎨 Visual Debugging

### Debug Container
- Extension appears in a centered container
- Simulates Chrome extension popup size
- Professional styling with shadows

### Debug Warning
- Yellow banner shows you're in debug mode
- Explains what APIs are mocked
- Links to console commands

## 🔄 Development Workflow

### Live Development
```bash
# Terminal 1: Watch for changes
npm run dev

# Terminal 2: Serve debug page
python3 -m http.server 3000

# Browser: http://localhost:3000/debug.html
```

### Production Testing
```bash
# Build and test production version
npm run debug:build
```

## 🐛 Troubleshooting

### Extension Not Loading
- Check console for TypeScript errors
- Verify `dist/` folder exists
- Make sure server is running on port 3000

### Storage Not Working
- Check localStorage in browser dev tools
- Look for keys prefixed with `debug_extension_`
- Use `debugHelpers.viewDebugData()` to inspect

### OAuth Testing Issues
- Verify scenario is set: `debugHelpers.setOAuthScenario('success')`
- Check console for mock OAuth flow logs
- Make sure Client ID format is valid

### Console Errors
- Chrome API errors are expected (we're mocking them)
- Focus on React/TypeScript errors
- Use browser dev tools for debugging

## 📝 Tips & Tricks

### Fast Iteration
1. Keep browser dev tools open
2. Use `debugHelpers.clearDebugData()` to reset state
3. Refresh page to see changes
4. Test different screen sizes

### Data Persistence
- localStorage survives browser refresh
- Clear with `debugHelpers.clearDebugData()` 
- Or manually clear in Application tab

### OAuth Simulation
- Default scenario is 'success'
- Change scenarios to test error handling
- Watch console for detailed OAuth flow logs

### API Call Monitoring
- All Chrome API calls are logged with emojis
- Storage operations show data being saved/loaded
- Identity operations show OAuth flow steps

## 🎉 Benefits of Debug Mode

✅ **No Chrome Extension Loading** - Test in any browser  
✅ **Faster Development** - No reload/refresh cycles  
✅ **Better Debugging** - Full browser dev tools access  
✅ **Scenario Testing** - Simulate different OAuth outcomes  
✅ **Data Persistence** - Test real storage behavior  
✅ **Console Access** - Rich debugging commands  
✅ **Visual Feedback** - See exactly what users see  

Happy debugging! 🚀 