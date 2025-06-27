import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

/**
 * Component for displaying error messages with optional dismiss functionality
 */
export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div 
      className="flex items-center gap-3 p-3 mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle 
        size={18} 
        className="flex-shrink-0 text-red-600" 
        aria-hidden="true" 
      />
      <span className="flex-1 text-sm font-medium">
        {message}
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex items-center justify-center w-6 h-6 border-none rounded-md bg-transparent text-red-600 cursor-pointer transition-all duration-200 hover:bg-red-100 focus:outline-2 focus:outline-red-500 focus:outline-offset-2"
          aria-label="Dismiss error"
          title="Dismiss"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
} 