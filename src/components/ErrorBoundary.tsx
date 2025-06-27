import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Error boundary component to catch and handle React errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to background script
    chrome.runtime.sendMessage({
      type: 'LOG_ERROR',
      error: error.message,
      stack: error.stack,
      errorInfo,
      timestamp: Date.now()
    }).catch(console.warn);

    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="flex flex-col items-center justify-center h-full p-6 bg-red-50 text-center"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle 
            size={48} 
            className="text-red-500 mb-4" 
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-4 text-sm max-w-xs">
            We encountered an unexpected error. Please try again.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm transition-colors"
              aria-label="Retry the last action"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Retry
            </button>
            
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm transition-colors"
              aria-label="Reload the extension"
            >
              Reload
            </button>
          </div>

          {/* Development error details would go here in a development build */}
        </div>
      );
    }

    return this.props.children;
  }
} 