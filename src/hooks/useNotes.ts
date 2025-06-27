import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { NotesStorage } from '../utils/storage';

interface UseNotesReturn {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  addNote: (content: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for managing notes state and operations
 */
export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const loadedNotes = await NotesStorage.getAllNotes();
      setNotes(loadedNotes);
      setError(null);
    } catch (err) {
      console.error('Failed to load notes:', err);
      setError('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = useCallback(async (content: string) => {
    if (!content.trim()) {
      setError('Note content cannot be empty');
      return;
    }

    try {
      setError(null);
      const newNote = await NotesStorage.saveNote(content);
      setNotes(prevNotes => [newNote, ...prevNotes]);
    } catch (err) {
      console.error('Failed to add note:', err);
      setError('Failed to add note');
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await NotesStorage.deleteNote(noteId);
      if (success) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      }
      return success;
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note');
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    notes,
    isLoading,
    error,
    addNote,
    deleteNote,
    clearError
  };
} 