/**
 * Type definitions for the search functionality
 */

/**
 * Represents a single search result item
 */
export interface SearchItem {
  readonly title: string;
  readonly url: string;
  readonly content: string;
  readonly type: string;
  readonly author?: string;
  readonly category?: string;
}

/**
 * Store mapping IDs to search items
 */
export interface SearchStore {
  readonly [key: string]: SearchItem;
}

/**
 * Extend Window interface to include our global search store
 * The store is populated by Jekyll during build time
 */
declare global {
  interface Window {
    readonly store: SearchStore;
  }
}

export {};
