/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitizes text input to prevent XSS attacks
 * @param input - Raw text input from user
 * @returns Sanitized text safe for display
 */
export function sanitizeTextInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validates note content length and format
 * @param content - Note content to validate
 * @returns Object with validation result and error message
 */
export function validateNoteContent(content: string): { 
  isValid: boolean; 
  error?: string; 
  sanitizedContent?: string;
} {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Note content cannot be empty' };
  }

  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Note content cannot be empty' };
  }

  if (trimmed.length > 10000) {
    return { isValid: false, error: 'Note content is too long (max 10,000 characters)' };
  }

  const sanitized = sanitizeTextInput(trimmed);
  return { 
    isValid: true, 
    sanitizedContent: sanitized 
  };
}

/**
 * Validates search input
 * @param searchTerm - Search term to validate
 * @returns Sanitized search term
 */
export function validateSearchInput(searchTerm: string): string {
  if (typeof searchTerm !== 'string') {
    return '';
  }

  return sanitizeTextInput(searchTerm).slice(0, 1000); // Limit search to 1000 chars
}

/**
 * Rate limiting for user actions
 */
class RateLimiter {
  private actions: Map<string, number[]> = new Map();

  /**
   * Check if action is allowed based on rate limits
   * @param actionType - Type of action (e.g., 'addNote', 'deleteNote')
   * @param maxActions - Maximum actions allowed per time window
   * @param timeWindow - Time window in milliseconds
   * @returns True if action is allowed
   */
  isActionAllowed(
    actionType: string, 
    maxActions: number = 10, 
    timeWindow: number = 60000
  ): boolean {
    const now = Date.now();
    const actionTimes = this.actions.get(actionType) || [];
    
    // Remove old actions outside time window
    const recentActions = actionTimes.filter(time => now - time < timeWindow);
    
    if (recentActions.length >= maxActions) {
      return false;
    }

    recentActions.push(now);
    this.actions.set(actionType, recentActions);
    return true;
  }

  /**
   * Clear all rate limiting data
   */
  clear(): void {
    this.actions.clear();
  }
}

export const rateLimiter = new RateLimiter(); 