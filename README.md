# Quick Notes Sidebar - Chrome Extension

A modern Chrome extension for quick note-taking with a beautiful sidebar interface. Built with React, TypeScript, and Vite for optimal performance and developer experience.

## 🚀 Features

- **Quick Note Taking**: Instantly capture thoughts with a simple textarea interface
- **🔍 Smart Search**: Find notes quickly with real-time search functionality
- **📋 Google Tasks Integration**: Push notes to Google Tasks with OAuth2 authentication
  - Push notes to your Google Tasks with one click
  - Revoke/remove notes from Google Tasks
  - Real-time sync status indicators
  - Automatic task title generation from note content
- **Local Storage**: Notes are saved using `chrome.storage.local` for persistence
- **Modern UI**: Clean, responsive design with Tailwind CSS utilities
- **Accessibility**: Full keyboard navigation and screen reader support  
- **Fast Performance**: Built with Vite for lightning-fast development and optimized builds
- **Consistent Styling**: Tailwind CSS ensures consistent design system and utility-first approach
- **TypeScript**: Type-safe development with comprehensive error handling
- **Future Ready**: Prepared for Notion API integration

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS 3 with PostCSS
- **Icons**: Lucide React
- **Extension**: Manifest V3
- **Storage**: Chrome Storage API

## 🛠️ Development Setup

### Prerequisites

- Node.js 16+ and npm
- Google Chrome browser

### Installation

1. **Clone and setup the project:**
   ```bash
   cd quick-notes-sidebar
   npm install
   ```
   
   This will install all dependencies including:
   - React 18 + TypeScript
   - Vite 4 for building
   - Tailwind CSS 3 for styling
   - Lucide React for icons

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

### 🔑 Google Tasks Setup (Optional)

To enable Google Tasks integration, you need to set up OAuth2 credentials:

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google Tasks API in the API Library

2. **Create OAuth2 Credentials:**
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Chrome Extension"
   - You'll need the extension ID (get this after loading the extension first)

3. **Update Configuration Files:**
   
   **Update `public/manifest.json`:**
   ```json
   "oauth2": {
     "client_id": "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com",
     "scopes": [
       "https://www.googleapis.com/auth/tasks"
     ]
   }
   ```

   **Update `src/utils/googleAuth.ts`:**
   ```typescript
   private getClientId(): string {
     return 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
   }
   ```

4. **Add Extension ID to Google OAuth:**
   - After loading the extension, copy its ID from Chrome extensions page
   - Add the extension ID to your Google OAuth2 client configuration

### Loading the Extension in Chrome

1. **Build the extension:**
   ```bash
   npm run build
   ```

2. **Open Chrome Extensions page:**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the extension:**
   - Click "Load unpacked"
   - Select the `dist` folder from your project

4. **Copy Extension ID (for Google OAuth setup):**
   - Note the extension ID shown on the extensions page
   - Use this ID in your Google Cloud OAuth configuration

5. **Test the extension:**
   - Click the extension icon in the Chrome toolbar
   - Start adding and searching notes!
   - Test Google Tasks integration if configured

## 📁 Project Structure

```
src/
├── background/           # Service worker
│   └── background.ts
├── components/           # React components (styled with Tailwind)
│   ├── AddNoteForm.tsx   # Main note input form
│   ├── ErrorMessage.tsx  # Error handling component
│   ├── GoogleAuth.tsx    # Google OAuth2 authentication
│   ├── NoteItem.tsx      # Individual note display with Google Tasks sync
│   ├── NotesList.tsx     # Notes list with search
│   └── SearchInput.tsx   # Search component with debouncing
├── hooks/               # Custom React hooks
│   └── useNotes.ts      # Notes state management
├── popup/              # Popup entry point
│   ├── App.tsx          # Main app component
│   ├── popup.tsx        # Entry point
│   └── App.css         # Global styles + Tailwind directives
├── types/              # TypeScript definitions
│   └── index.ts        # Note, search, and Google Tasks interfaces
└── utils/              # Utility functions
    ├── storage.ts      # Storage management with search & sync status
    ├── googleAuth.ts   # Google OAuth2 authentication service
    └── googleTasks.ts  # Google Tasks API integration
```

## 🎯 Usage

### Adding Notes
- Click the extension icon to open the sidebar
- Type your note in the textarea
- Press `Ctrl+Enter` or click "Add Note" to save
- Notes are automatically saved to local storage

### 🔍 **Search Functionality**

#### **Real-time Search**
- Use the search bar at the top to find notes instantly
- Search is case-insensitive and searches through note content
- Results update automatically as you type (with 300ms debounce)
- Clear search with the X button or press Escape

#### **Search Features**
- **Debounced input**: Smooth typing experience without lag
- **Instant results**: No need to press Enter
- **Clear feedback**: Shows number of results found
- **Keyboard shortcuts**: Press Escape to clear search

### 📋 Google Tasks Integration

#### **Authentication**
- Click "Connect Google" to authenticate with your Google account
- Grant permission to access Google Tasks
- Once connected, you'll see your email and a "Disconnect" option

#### **Syncing Notes**
- **Push to Google Tasks**: Click the upload icon (↑) on any note to create a task
- **Remove from Google Tasks**: Click the X icon on synced notes to remove from Google Tasks
- **Sync Status Indicators**:
  - 🟢 **Synced**: Note is successfully synced with Google Tasks
  - 🟡 **Pending**: Sync operation in progress
  - 🔴 **Error**: Sync failed (hover for details)

#### **Task Details**
- **Task Title**: First line of your note becomes the task title
- **Task Description**: Remaining content becomes the task description
- **Task List**: Notes are added to your default "My Tasks" list
- **Real-time Updates**: Changes are reflected immediately in both apps

### Managing Notes
- View all notes in chronological order (newest first)
- Search through notes to find specific content quickly
- Click the trash icon to delete individual notes
- Notes persist across browser sessions
- Sync individual notes with Google Tasks (if connected)

### ⌨️ **Keyboard Shortcuts**

#### **General**
- `Ctrl+Enter` (or `Cmd+Enter` on Mac): Save current note
- `Tab` / `Shift+Tab`: Navigate between form elements

#### **Search**
- `Escape`: Clear search input
- Type in search box: Real-time filtering

#### **Navigation**
- `Enter` on delete button: Confirm note deletion
- Arrow keys: Navigate through UI elements

## 🔧 Configuration

### Tailwind CSS Configuration
The project uses Tailwind CSS for styling with custom configuration:
- **Config file**: `tailwind.config.js` - Custom colors and utilities
- **PostCSS**: `postcss.config.js` - PostCSS with Tailwind and Autoprefixer
- **Global styles**: `src/popup/App.css` - Tailwind directives and custom utilities

### Manifest V3 Configuration
The extension uses Manifest V3 with minimal permissions:
- `storage`: For saving notes locally
- `action`: For popup interface

### Storage Management
Notes are stored using `chrome.storage.local`. The storage structure:

```typescript
interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  googleTaskId?: string;  // Google Tasks integration
  syncStatus: 'none' | 'synced' | 'pending' | 'error';
}

interface SearchFilter {
  searchTerm: string;
}

interface GoogleAuthState {
  isAuthenticated: boolean;
  email?: string;
  accessToken?: string;
  expiresAt?: number;
}
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Extension loads without errors
- [ ] Add new notes functionality
- [ ] Search functionality works with real-time filtering
- [ ] Delete notes functionality
- [ ] Search results update correctly
- [ ] Notes persist after browser restart
- [ ] Keyboard shortcuts work
- [ ] Accessibility features function
- [ ] Error handling displays properly

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # TypeScript type checking
npm run preview      # Preview production build
```

### 🐞 Local Debugging

To debug the extension locally in your browser:

1. **Build the extension:**
   ```bash
   npm run build
   ```

2. **Open `debug.html` in your browser:**
   - This file loads the built extension in a regular browser window
   - Perfect for debugging CSS and JavaScript issues
   - Simulates the extension popup environment

3. **For Chrome Extension debugging:**
   - Load the extension in Chrome (see installation instructions above)
   - Right-click the extension icon → "Inspect popup"
   - Use Chrome DevTools to debug

## 🐛 Troubleshooting

### Common Issues

**Extension not loading:**
- Ensure you've run `npm run build` first
- Check the console for errors in `chrome://extensions/`
- Verify all files are present in the `dist` folder

**Notes not saving:**
- Check if storage permission is granted
- Open DevTools in the popup and check for errors
- Verify the background script is running

**Search not working:**
- Try refreshing the extension popup
- Check that notes contain the text you're searching for
- Clear the search and try again

**Build errors:**
- Clear `node_modules` and run `npm install` again
- Ensure Node.js version is 16+
- Check for TypeScript errors with `npm run type-check`

## 🔮 Future Enhancements

### Planned Features
- **Notion API Integration**: Sync notes with Notion databases
- **Enhanced Search**: Full-text search with highlighting and filters
- **Export Options**: Download notes as text/markdown
- **Themes**: Light/dark mode support
- **Sync**: Cross-device synchronization
- **Categories**: Simple note categorization
- **Bulk Operations**: Select and delete multiple notes

### Notion Integration Setup (Coming Soon)
```typescript
interface NotionConfig {
  token: string;
  databaseId: string;
  syncEnabled: boolean;
}
```

## 💡 Tips & Tricks

1. **Use descriptive content**: Write clear, searchable note content
2. **Search efficiently**: Use specific keywords to find notes quickly
3. **Keyboard shortcuts**: Use Ctrl+Enter for quick note saving
4. **Regular cleanup**: Delete old notes you no longer need
5. **Search patterns**: Try searching for partial words or phrases

---

**Happy Note-Taking! 📝🔍** Your notes are now simple, fast, and easily searchable!

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper TypeScript types
4. Test the extension thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or as a base for your own extensions.

## 🙏 Acknowledgments

- React team for the excellent framework
- Vite team for the lightning-fast build tool
- Lucide for the beautiful icons
- Chrome Extensions team for the comprehensive APIs 