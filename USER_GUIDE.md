# 📝 Quick Notes Extension - User Guide

## 🚀 Getting Started

This Chrome extension allows you to take quick notes and optionally sync them with Google Tasks using Chrome's built-in OAuth system.

## 📥 Installation

1. **Download or clone** this repository
2. **Build the extension**:
   ```bash
   npm install
   npm run build
   ```
3. **Load in Chrome**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 🔧 Google Tasks Integration Setup

### Prerequisites
- Google Account
- Google Cloud Console access

### Quick Setup Steps

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable **Google Tasks API**

2. **Configure OAuth**:
   - Go to **APIs & Services** → **Credentials**
   - Create **"Web Application"** OAuth Client ID (NOT Chrome Extension)
   - Add redirect URI: `https://YOUR_EXTENSION_ID.chromiumapp.org/`
   - Configure OAuth consent screen with your email as test user

3. **Update Extension**:
   - Copy your Client ID
   - Update `public/manifest.json`:
   ```json
   {
     "oauth2": {
       "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
       "scopes": ["https://www.googleapis.com/auth/tasks"]
     }
   }
   ```
   - Rebuild: `npm run build`
   - Reload extension in Chrome

## 📱 How to Use

### Basic Note Taking
1. **Click the extension icon** in Chrome toolbar
2. **Type your note** in the text area
3. **Press Ctrl+Enter** or click "Add Note" to save
4. **Search notes** using the search box
5. **Delete notes** by clicking the trash icon

### Google Tasks Sync
1. **Click "Connect Google"** in the extension
2. **Approve access** in the Google OAuth popup
3. **Sync individual notes**:
   - Click the "Push to Google" button on any note
   - Note will appear in your Google Tasks
   - Click "Remove from Google" to unsync

### Sync Status Indicators
- **None**: Note is local only
- **Synced**: Note is synced with Google Tasks
- **Pending**: Sync in progress
- **Error**: Sync failed (check connection)

## 🎯 Features

### ✅ Core Features
- **Quick note taking** with auto-save
- **Real-time search** through notes
- **Persistent storage** using Chrome storage
- **Clean, modern UI** with dark/light theme support

### ✅ Google Integration
- **OAuth2 authentication** using Chrome Identity API
- **Bi-directional sync** with Google Tasks
- **Individual note control** - sync only what you want
- **Sync status tracking** with visual indicators
- **Automatic token management** by Chrome

### ✅ Developer Features
- **Local debug mode** for testing without OAuth
- **TypeScript support** for better development
- **Comprehensive error handling**
- **Accessible UI** with proper ARIA labels

## 🔍 Debug Mode

For development and testing without Google OAuth:

```bash
npm run debug
```

Open http://localhost:3000/debug.html to test locally with mock data.

## 🐛 Troubleshooting

### OAuth Issues
- **"Authorization page could not be loaded"**: Use "Web Application" Client ID, not "Chrome Extension"
- **"redirect_uri_mismatch"**: Verify redirect URI exactly matches: `https://YOUR_EXTENSION_ID.chromiumapp.org/`
- **"access_blocked"**: Add your email as test user in OAuth consent screen

### General Issues
- **Notes not saving**: Check Chrome storage permissions
- **Extension not loading**: Check console errors in `chrome://extensions/`
- **Search not working**: Clear and re-enter search term

### Getting Help
- Check browser console for error messages (F12)
- Verify Google Cloud Console configuration
- Ensure Google Tasks API is enabled

## 🔒 Privacy & Security

- **OAuth tokens** are stored securely by Chrome
- **Notes are stored locally** in Chrome storage
- **No data collection** - everything stays on your device
- **Optional sync** - Google integration is completely optional
- **Minimal permissions** - only requests necessary scopes

## 🛠️ Technical Details

### Technologies Used
- **React 18** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Chrome Extension Manifest V3**
- **Chrome Identity API** for OAuth
- **Google Tasks API** for task management

### Storage
- Local notes stored in `chrome.storage.local`
- OAuth tokens managed by Chrome Identity API
- No external servers or databases

### Permissions
- `storage` - for saving notes locally
- `identity` - for Google OAuth authentication
- `host_permissions` - for Google Tasks API access

## 📋 Keyboard Shortcuts

- **Ctrl+Enter** - Save current note
- **Escape** - Clear search box
- **Tab** - Navigate between UI elements

## 🎨 Customization

The extension uses Tailwind CSS for styling. To customize:

1. Edit styles in component files
2. Modify `tailwind.config.js` for theme changes
3. Rebuild with `npm run build`

## 📄 License

This project is open source. Feel free to modify and distribute according to your needs.

---

**Enjoy taking quick notes and staying organized!** 📝✨ 