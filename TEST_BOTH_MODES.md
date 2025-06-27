# 🧪 Test Both Modes - Quick Fix Guide

## Problem Summary
- **Local Debug**: Storage not saving properly
- **Chrome Extension**: OAuth connection fails

## ✅ Quick Fix Steps

### 1. Test Local Debug Mode
```bash
npm run debug
```
Then open: http://localhost:3000/debug.html

**Testing Steps:**
1. Open browser console
2. Run: `debugHelpers.setOAuthScenario('success')`
3. Try adding a note - should now save properly
4. Try "Connect Google" - should work in debug mode
5. Run: `debugHelpers.viewDebugData()` to see stored data

### 2. Fix Chrome Extension OAuth

**Step A: Get Your Extension ID**
```bash
npm run build
```
1. Load the `dist/` folder in Chrome (`chrome://extensions/`)
2. Copy your Extension ID (like: `abcdefghijklmnopqrstuvwxyz123456`)

**Step B: Update Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click your OAuth 2.0 Client ID: `152561372819-recngrjvvpaiurtt1868k8grftec2u63`
4. In **Authorized redirect URIs**, add:
   ```
   https://YOUR_EXTENSION_ID.chromiumapp.org/
   ```
   (Replace with your actual Extension ID from Step A)

**Step C: Test in Chrome**
1. Reload the extension in Chrome
2. Open the extension popup
3. Click "Connect Google"
4. Should now open a browser window for OAuth

## 🔍 Debug Information

### Local Debug Console Commands
```javascript
// Test different OAuth scenarios
debugHelpers.setOAuthScenario('success')
debugHelpers.setOAuthScenario('cancel')
debugHelpers.setOAuthScenario('error')

// Check storage
debugHelpers.viewDebugData()
debugHelpers.clearDebugData()
```

### Chrome Extension Console
Open DevTools on the extension popup and look for:
```
🔐 Starting OAuth with Client ID: 152561372819-recngr...
🚀 Chrome extension OAuth flow
🔗 Auth URL: https://accounts.google.com/oauth/authorize?...
🔄 Redirect URI: https://YOUR_EXTENSION_ID.chromiumapp.org/
```

## ✅ Success Checklist

### Local Debug Mode:
- [x] Notes save properly
- [x] OAuth simulation works
- [x] Console shows storage operations
- [x] `debugHelpers` commands work

### Chrome Extension:
- [ ] Get Extension ID
- [ ] Add redirect URI to Google Cloud Console
- [ ] Rebuild and reload extension
- [ ] OAuth opens browser window
- [ ] Successfully connects to Google

## 🎯 Expected Results

**Local Debug**: 
- Notes should save and persist
- OAuth should simulate successfully
- Console shows detailed debug info

**Chrome Extension**:
- OAuth should open Google login in new browser window
- After login, should show "Connected as: your@email.com"
- Notes can be pushed to Google Tasks

The main issue is the **redirect URI mismatch** - once you add your actual Chrome Extension ID to Google Cloud Console, OAuth will work perfectly! 🚀 