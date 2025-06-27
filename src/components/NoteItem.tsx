import React from 'react';
import { Trash2, Calendar } from 'lucide-react';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  onDelete: (noteId: string) => void;
  onUpdate?: (note: Note) => void;
}

/**
 * Component for displaying a single note with delete functionality
 */
export function NoteItem({ note, onDelete }: NoteItemProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    // Convert line breaks to <br> tags for proper display
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white transition-all duration-200 mb-3 hover:border-gray-300 hover:shadow-sm hover:shadow-gray-100">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <Calendar size={14} aria-hidden="true" />
          <span className="text-xs">
            {formatDate(note.createdAt)}
            {note.updatedAt !== note.createdAt && (
              <span className="text-gray-400 italic"> (edited)</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="flex items-center justify-center w-8 h-8 border-none rounded-md bg-transparent text-gray-500 cursor-pointer transition-all duration-200 flex-shrink-0 hover:bg-red-50 hover:text-red-600 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
            onClick={handleDelete}
            aria-label="Delete note"
            title="Delete note"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      
      <div className="min-w-0">
        <p className="m-0 text-sm leading-relaxed text-gray-700 break-words whitespace-pre-wrap">
          {formatContent(note.content)}
        </p>
      </div>
    </div>
  );
} 