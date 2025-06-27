/**
 * Represents a single note in the application
 */
export interface Note {
  /** Unique identifier for the note */
  id: string;
  /** The content/text of the note */
  content: string;
  /** Timestamp when the note was created */
  createdAt: number;
  /** Timestamp when the note was last updated */
  updatedAt: number;
}

/**
 * Search filter interface for filtering notes
 */
export interface SearchFilter {
  /** Search term to filter notes by content */
  searchTerm: string;
} 