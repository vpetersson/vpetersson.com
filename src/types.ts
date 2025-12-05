// Type definitions for the search functionality

export interface SearchItem {
  title: string;
  url: string;
  content: string;
  type: string;
  author?: string;
  category?: string;
}

export interface SearchStore {
  [key: string]: SearchItem;
}

// Extend Window interface to include our global store
declare global {
  interface Window {
    store: SearchStore;
    lunr: any; // lunr is loaded from external minified file
  }
}

export {};
