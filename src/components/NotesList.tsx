import { Note, SearchFilter } from '../types';
import { NoteItem } from './NoteItem';
import { SearchInput } from './SearchInput';

interface NotesListProps {
  notes: Note[];
  searchFilter: SearchFilter;
  onSearchChange: (filter: SearchFilter) => void;
  onDeleteNote: (noteId: string) => Promise<boolean>;
  onUpdateNote?: (note: Note) => void;
  isLoading?: boolean;
}

/**
 * Component for displaying a list of notes with search functionality
 */
export function NotesList({ 
  notes, 
  searchFilter, 
  onSearchChange, 
  onDeleteNote,
  onUpdateNote,
  isLoading = false 
}: NotesListProps) {
  const handleSearchTermChange = (searchTerm: string) => {
    onSearchChange({ searchTerm });
  };

  const handleDelete = async (noteId: string) => {
    await onDeleteNote(noteId);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-center py-10 px-4 text-gray-500 text-sm">
          Loading notes...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <SearchInput
        searchTerm={searchFilter.searchTerm}
        onSearchChange={handleSearchTermChange}
        placeholder="Search notes..."
      />
      
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-gray-500">
          {searchFilter.searchTerm ? (
            <>
              <p className="m-0 mb-2 text-base font-medium text-gray-700">
                No notes found matching "{searchFilter.searchTerm}"
              </p>
              <p className="m-0 text-sm text-gray-500 font-normal">
                Try a different search term
              </p>
            </>
          ) : (
            <>
              <p className="m-0 mb-2 text-base font-medium text-gray-700">
                No notes yet
              </p>
              <p className="m-0 text-sm text-gray-500 font-normal">
                Create your first note above!
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="mt-4">
          {searchFilter.searchTerm && (
            <div className="py-2 px-3 mb-4 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700 text-center">
              Found {notes.length} note{notes.length === 1 ? '' : 's'} 
              {searchFilter.searchTerm && ` for "${searchFilter.searchTerm}"`}
            </div>
          )}
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onUpdate={onUpdateNote}
            />
          ))}
        </div>
      )}
    </div>
  );
} 