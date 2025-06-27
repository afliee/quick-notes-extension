import { Note } from '../types';
import { validateNoteContent, rateLimiter } from './security';

const STORAGE_KEY = 'quickNotes';
const MAX_NOTES = 1000; // Prevent storage abuse

/**
 * Storage utility for managing notes in Chrome extension storage
 */
export class NotesStorage {
  /**
   * Get all notes from storage
   */
  static async getAllNotes(): Promise<Note[]> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const notes = result[STORAGE_KEY] || [];
      
      // Ensure all notes have the proper structure
      return notes.map((note: any) => ({
        id: note.id,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      }));
    } catch (error) {
      console.error('Failed to get notes from storage:', error);
      return [];
    }
  }

  /**
   * Save a new note to storage
   */
  static async saveNote(content: string): Promise<Note> {
    try {
      // Rate limiting
      if (!rateLimiter.isActionAllowed('addNote', 20, 60000)) {
        throw new Error('Too many notes created. Please wait a moment.');
      }

      // Validate and sanitize content
      const validation = validateNoteContent(content);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid note content');
      }

      const notes = await this.getAllNotes();
      
      // Check storage limits
      if (notes.length >= MAX_NOTES) {
        throw new Error(`Maximum number of notes (${MAX_NOTES}) reached`);
      }

      const now = Date.now();
      
      const newNote: Note = {
        id: crypto.randomUUID(),
        content: validation.sanitizedContent!,
        createdAt: now,
        updatedAt: now,
      };

      notes.unshift(newNote); // Add to beginning of array
      await chrome.storage.local.set({ [STORAGE_KEY]: notes });
      
      return newNote;
    } catch (error) {
      console.error('Failed to save note to storage:', error);
      // Report error to background script
      chrome.runtime.sendMessage({
        type: 'LOG_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        action: 'saveNote'
      });
      throw error;
    }
  }

  /**
   * Delete a note from storage
   */
  static async deleteNote(noteId: string): Promise<boolean> {
    try {
      const notes = await this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== noteId);
      
      if (filteredNotes.length === notes.length) {
        return false; // Note not found
      }
      
      await chrome.storage.local.set({ [STORAGE_KEY]: filteredNotes });
      return true;
    } catch (error) {
      console.error('Failed to delete note from storage:', error);
      throw new Error('Failed to delete note');
    }
  }

  /**
   * Update a note in storage
   */
  static async updateNote(noteId: string, content: string): Promise<Note | null> {
    try {
      const notes = await this.getAllNotes();
      const noteIndex = notes.findIndex(note => note.id === noteId);
      
      if (noteIndex === -1) {
        return null; // Note not found
      }
      
      const updatedNote: Note = {
        ...notes[noteIndex],
        content: content.trim(),
        updatedAt: Date.now(),
      };
      
      notes[noteIndex] = updatedNote;
      await chrome.storage.local.set({ [STORAGE_KEY]: notes });
      
      return updatedNote;
    } catch (error) {
      console.error('Failed to update note in storage:', error);
      throw new Error('Failed to update note');
    }
  }

  /**
   * Filter notes by search term
   */
  static filterNotesBySearch(notes: Note[], searchTerm: string): Note[] {
    if (!searchTerm.trim()) {
      return notes;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return notes.filter(note => 
      note.content.toLowerCase().includes(term)
    );
  }

  /**
   * Clear all notes from storage
   */
  static async clearAllNotes(): Promise<void> {
    try {
      await chrome.storage.local.remove(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear notes from storage:', error);
      throw new Error('Failed to clear notes');
    }
  }

  /**
   * Get storage usage statistics
   */
  static async getStorageStats(): Promise<{ notesCount: number; storageUsed: number }> {
    try {
      const notes = await this.getAllNotes();
      const result = await chrome.storage.local.get(null);
      const storageUsed = JSON.stringify(result).length;
      
      return {
        notesCount: notes.length,
        storageUsed
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { notesCount: 0, storageUsed: 0 };
    }
  }
} 