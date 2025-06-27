# Notion API Integration Guide

This document outlines how to integrate the Quick Notes Sidebar extension with Notion API for seamless note synchronization.

## 🎯 Overview

The Notion integration will allow users to:
- Sync notes to a Notion database
- Bidirectional synchronization (local ↔ Notion)
- Automatic backup of notes
- Rich text formatting support
- Tags and categorization

## 🛠️ Setup Requirements

### 1. Notion API Token
1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name it "Quick Notes Sidebar"
4. Save the integration token (starts with `secret_`)

### 2. Database Setup
Create a Notion database with these properties:
- **Title** (Title property) - Note content
- **Created** (Created time)
- **Modified** (Last edited time)
- **ID** (Text) - Extension note ID
- **Tags** (Multi-select) - For categorization
- **Status** (Select) - Active, Archived, etc.

### 3. Database Permissions
1. Share your database with the integration
2. Copy the database ID from the URL

## 🔧 Implementation Plan

### Phase 1: Configuration UI
Add settings page for Notion configuration:

```typescript
// src/types/notion.ts
export interface NotionConfig {
  token: string;
  databaseId: string;
  syncEnabled: boolean;
  autoSync: boolean;
  syncInterval: number; // minutes
}

export interface NotionPage {
  id: string;
  title: string;
  created_time: string;
  last_edited_time: string;
  properties: {
    Title: {
      title: Array<{
        plain_text: string;
      }>;
    };
    ID: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
  };
}
```

### Phase 2: Notion API Service
```typescript
// src/services/notionApi.ts
export class NotionAPI {
  private token: string;
  private databaseId: string;

  constructor(config: NotionConfig) {
    this.token = config.token;
    this.databaseId = config.databaseId;
  }

  async createPage(note: Note): Promise<string> {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: this.databaseId },
        properties: {
          Title: {
            title: [{ text: { content: note.content } }]
          },
          ID: {
            rich_text: [{ text: { content: note.id } }]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  }

  async updatePage(notionPageId: string, note: Note): Promise<void> {
    await fetch(`https://api.notion.com/v1/pages/${notionPageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        properties: {
          Title: {
            title: [{ text: { content: note.content } }]
          }
        }
      })
    });
  }

  async deletePage(notionPageId: string): Promise<void> {
    await fetch(`https://api.notion.com/v1/pages/${notionPageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        archived: true
      })
    });
  }

  async queryDatabase(): Promise<NotionPage[]> {
    const response = await fetch(`https://api.notion.com/v1/databases/${this.databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        filter: {
          property: 'Status',
          select: {
            equals: 'Active'
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  }
}
```

### Phase 3: Sync Manager
```typescript
// src/services/syncManager.ts
export class SyncManager {
  private notionAPI: NotionAPI;
  private storage: typeof NotesStorage;

  constructor(config: NotionConfig) {
    this.notionAPI = new NotionAPI(config);
    this.storage = NotesStorage;
  }

  async syncToNotion(): Promise<void> {
    const localNotes = await this.storage.getAllNotes();
    const syncData = await this.getSyncData();

    for (const note of localNotes) {
      const existingSync = syncData.find(s => s.noteId === note.id);
      
      if (!existingSync) {
        // Create new page in Notion
        const notionPageId = await this.notionAPI.createPage(note);
        await this.saveSyncData(note.id, notionPageId, note.updatedAt);
      } else if (note.updatedAt > existingSync.lastSynced) {
        // Update existing page
        await this.notionAPI.updatePage(existingSync.notionPageId, note);
        await this.updateSyncData(note.id, note.updatedAt);
      }
    }
  }

  async syncFromNotion(): Promise<void> {
    const notionPages = await this.notionAPI.queryDatabase();
    const localNotes = await this.storage.getAllNotes();

    for (const page of notionPages) {
      const noteId = this.extractNoteId(page);
      const localNote = localNotes.find(n => n.id === noteId);

      if (!localNote) {
        // Create local note from Notion page
        const note: Note = {
          id: noteId || this.generateId(),
          content: this.extractTitle(page),
          createdAt: new Date(page.created_time).getTime(),
          updatedAt: new Date(page.last_edited_time).getTime()
        };
        
        await this.storage.addNote(note.content);
      }
    }
  }

  private async getSyncData(): Promise<SyncData[]> {
    const result = await chrome.storage.local.get('notionSync');
    return result.notionSync || [];
  }

  private async saveSyncData(noteId: string, notionPageId: string, lastSynced: number): Promise<void> {
    const syncData = await this.getSyncData();
    syncData.push({ noteId, notionPageId, lastSynced });
    await chrome.storage.local.set({ notionSync: syncData });
  }

  private extractTitle(page: NotionPage): string {
    return page.properties.Title.title[0]?.plain_text || '';
  }

  private extractNoteId(page: NotionPage): string | null {
    return page.properties.ID.rich_text[0]?.plain_text || null;
  }
}

interface SyncData {
  noteId: string;
  notionPageId: string;
  lastSynced: number;
}
```

### Phase 4: Settings Component
```typescript
// src/components/NotionSettings.tsx
import { useState, useEffect } from 'react';

export function NotionSettings() {
  const [config, setConfig] = useState<NotionConfig>({
    token: '',
    databaseId: '',
    syncEnabled: false,
    autoSync: false,
    syncInterval: 30
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const notionAPI = new NotionAPI(config);
      await notionAPI.queryDatabase();
      setConnectionStatus('success');
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="notion-settings">
      <h3>Notion Integration</h3>
      
      <div className="form-group">
        <label htmlFor="notion-token">Integration Token:</label>
        <input
          id="notion-token"
          type="password"
          value={config.token}
          onChange={(e) => setConfig({ ...config, token: e.target.value })}
          placeholder="secret_..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="database-id">Database ID:</label>
        <input
          id="database-id"
          type="text"
          value={config.databaseId}
          onChange={(e) => setConfig({ ...config, databaseId: e.target.value })}
          placeholder="Database ID from Notion URL"
        />
      </div>

      <button onClick={testConnection} disabled={isTestingConnection}>
        {isTestingConnection ? 'Testing...' : 'Test Connection'}
      </button>

      {connectionStatus === 'success' && (
        <div className="success-message">✅ Connection successful!</div>
      )}

      {connectionStatus === 'error' && (
        <div className="error-message">❌ Connection failed. Check your credentials.</div>
      )}
    </div>
  );
}
```

## 🔒 Security Considerations

1. **Token Storage**: Store Notion tokens in `chrome.storage.local` with encryption
2. **HTTPS Only**: All API calls must use HTTPS
3. **Rate Limiting**: Implement proper rate limiting for API calls
4. **Error Handling**: Graceful handling of API failures

## 📋 Manifest Updates

Add additional permissions for Notion API:

```json
{
  "permissions": [
    "storage",
    "https://api.notion.com/*"
  ],
  "host_permissions": [
    "https://api.notion.com/*"
  ]
}
```

## 🧪 Testing Strategy

1. **Unit Tests**: Test API service methods
2. **Integration Tests**: Test sync scenarios
3. **Manual Testing**: Real Notion database testing
4. **Error Cases**: Network failures, invalid tokens

## 🚀 Deployment Steps

1. Update manifest with new permissions
2. Add Notion settings UI
3. Implement sync logic
4. Add background sync scheduling
5. Update user documentation

## 📊 Usage Analytics (Optional)

Track sync metrics:
- Sync frequency
- Success/failure rates
- Data volume synced
- User engagement with Notion features

This integration will provide a seamless note-taking experience with the power of Notion's organizational features. 