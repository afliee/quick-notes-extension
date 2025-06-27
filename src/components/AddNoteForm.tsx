import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddNoteFormProps {
  onAddNote: (content: string) => Promise<void>;
}

/**
 * Form component for adding new notes
 */
export function AddNoteForm({ onAddNote }: AddNoteFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddNote(content);
      setContent(''); // Clear form on success
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 border-b border-gray-200 bg-white"
      role="form"
      aria-label="Add new note form"
    >
      <div className="relative">
        <label htmlFor="note-content" className="sr-only">
          Note content
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new note... (Cmd/Ctrl+Enter to save)"
          className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          rows={3}
          disabled={isSubmitting}
          aria-describedby="note-help"
          aria-required="true"
          maxLength={10000}
        />
        <div id="note-help" className="sr-only">
          Enter your note content. Use Cmd+Enter or Ctrl+Enter to save quickly.
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="absolute right-2 bottom-2 flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-md border-none cursor-pointer transition-all duration-200 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Add note (Cmd/Ctrl+Enter)"
          aria-label={isSubmitting ? 'Saving note...' : 'Add note'}
        >
          <Plus size={16} aria-hidden="true" />
          <span className="sr-only">
            {isSubmitting ? 'Saving note...' : 'Add note'}
          </span>
        </button>
      </div>
    </form>
  );
} 