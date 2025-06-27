import { useState, useMemo } from 'react';
import { useNotes } from '../hooks/useNotes';
import { AddNoteForm } from '../components/AddNoteForm';
import { NotesList } from '../components/NotesList';
import { ErrorMessage } from '../components/ErrorMessage';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Header } from '../components/Header';
import { SettingsPage } from '../components/SettingsPage';
import { NotesStorage } from '../utils/storage';
import { SearchFilter } from '../types';
import './App.css';

/**
 * Main application component for the Quick Notes Sidebar
 */
export function App() {
  const {
    notes,
    isLoading,
    error,
    addNote,
    deleteNote,
    clearError
  } = useNotes();

  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    searchTerm: ''
  });

  const [currentView, setCurrentView] = useState<'notes' | 'settings'>('notes');

  // Filter notes based on search term
  const filteredNotes = useMemo(() => {
    return NotesStorage.filterNotesBySearch(notes, searchFilter.searchTerm);
  }, [notes, searchFilter.searchTerm]);

  const handleSettingsClick = () => {
    setCurrentView('settings');
  };

  const handleBackToNotes = () => {
    setCurrentView('notes');
  };

  // Settings View
  if (currentView === 'settings') {
    return (
      <ErrorBoundary>
        <div className="app flex flex-col h-screen bg-gray-50 text-gray-700">
          <SettingsPage onBack={handleBackToNotes} />
        </div>
      </ErrorBoundary>
    );
  }

  // Main Notes View
  return (
    <ErrorBoundary>
      <div className="app flex flex-col h-screen bg-gray-50 text-gray-700">
        <Header onSettingsClick={handleSettingsClick} />

        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={clearError}
          />
        )}

        <main className="flex flex-col flex-1 overflow-hidden">
          <AddNoteForm 
            onAddNote={addNote} 
          />
          <NotesList
            notes={filteredNotes}
            searchFilter={searchFilter}
            onSearchChange={setSearchFilter}
            onDeleteNote={deleteNote}
            onUpdateNote={() => {
              // Trigger a refresh of notes to update the UI
              window.location.reload();
            }}
            isLoading={isLoading}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
} 