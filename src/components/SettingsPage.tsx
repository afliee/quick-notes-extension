import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { NotesStorage } from '../utils/storage';

interface SettingsPageProps {
  onBack: () => void;
}

/**
 * Settings page component for app configuration
 */
export function SettingsPage({ onBack }: SettingsPageProps) {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAllNotes = async () => {
    if (!window.confirm('Are you sure you want to delete all notes? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      await NotesStorage.clearAllNotes();
      // Refresh the page to update the notes list
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear notes:', error);
      alert('Failed to clear notes. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 mr-3 border-none rounded-md bg-transparent text-gray-600 cursor-pointer transition-colors duration-200 hover:bg-gray-100 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
          aria-label="Back to notes"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Settings</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* App Information */}
          <section>
            <h2 className="text-base font-medium text-gray-800 mb-3">App Information</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Description:</strong> A quick note-taking extension</p>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section>
            <h2 className="text-base font-medium text-gray-800 mb-3">Data Management</h2>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h3 className="text-sm font-medium text-red-800 mb-2">Clear All Notes</h3>
                <p className="text-xs text-red-600 mb-3">
                  This will permanently delete all your notes. This action cannot be undone.
                </p>
                <button
                  onClick={handleClearAllNotes}
                  disabled={isClearing}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white border-none rounded-md text-sm cursor-pointer transition-colors duration-200 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed focus:outline-2 focus:outline-red-500 focus:outline-offset-2"
                >
                  <Trash2 size={14} />
                  {isClearing ? 'Clearing...' : 'Clear All Notes'}
                </button>
              </div>
            </div>
          </section>

          {/* Usage Tips */}
          <section>
            <h2 className="text-base font-medium text-gray-800 mb-3">Usage Tips</h2>
            <div className="p-4 bg-blue-50 rounded-lg">
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Use <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Cmd/Ctrl+Enter</kbd> to quickly save notes</li>
                <li>• Use the search bar to find specific notes</li>
                <li>• Click the trash icon to delete individual notes</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 