/**
 * Search functionality using Lunr.js
 * Provides client-side full-text search with result rendering
 */
import lunr from 'lunr';
import type { SearchStore } from './types';

(function initializeSearch(): void {
  'use strict';

  const CONFIG = {
    TITLE_BOOST: 10,
    PREVIEW_LENGTH: 150,
    SEARCH_PARAM: 'query',
  } as const;

  const ELEMENT_IDS = {
    RESULTS: 'search-results',
    SEARCH_BOX: 'search-box',
  } as const;

  /**
   * Escapes HTML special characters to prevent XSS attacks
   */
  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Creates a search result list item element
   */
  function createSearchResultElement(
    item: SearchStore[string],
    isLast: boolean
  ): DocumentFragment {
    const fragment = document.createDocumentFragment();
    
    // Create list item
    const li = document.createElement('li');
    li.className = 'search-item';
    
    // Create link with title
    const link = document.createElement('a');
    link.href = escapeHtml(item.url);
    
    const title = document.createElement('h3');
    title.textContent = item.title;
    link.appendChild(title);
    li.appendChild(link);
    
    // Create content preview
    const contentPreview = document.createElement('p');
    contentPreview.className = 'search-content';
    const preview = item.content.substring(0, CONFIG.PREVIEW_LENGTH);
    contentPreview.textContent = preview + (item.content.length > CONFIG.PREVIEW_LENGTH ? '...' : '');
    li.appendChild(contentPreview);
    
    // Create type label
    const typeLabel = document.createElement('p');
    typeLabel.className = 'search-content-type';
    typeLabel.textContent = item.type;
    li.appendChild(typeLabel);
    
    fragment.appendChild(li);
    
    // Add separator if not last item
    if (!isLast) {
      const separator = document.createElement('hr');
      separator.className = 'search-result-separator border-[#d3d3d366]';
      fragment.appendChild(separator);
    }
    
    return fragment;
  }

  /**
   * Displays search results in the DOM
   */
  function displaySearchResults(
    results: readonly lunr.Index.Result[],
    store: SearchStore
  ): void {
    const searchResults = document.getElementById(ELEMENT_IDS.RESULTS);
    
    if (!searchResults) {
      console.error('Search results container not found');
      return;
    }

    // Clear existing results
    searchResults.innerHTML = '';

    if (results.length === 0) {
      const noResults = document.createElement('li');
      noResults.textContent = 'No results found';
      noResults.setAttribute('role', 'status');
      searchResults.appendChild(noResults);
      return;
    }

    // Set ARIA attributes
    searchResults.setAttribute('role', 'list');
    searchResults.setAttribute('aria-label', `${results.length} search results`);

    // Create and append result elements
    results.forEach((result, index) => {
      const item = store[result.ref];
      if (!item) {
        console.warn(`Search result with ref "${result.ref}" not found in store`);
        return;
      }
      
      const element = createSearchResultElement(item, index === results.length - 1);
      searchResults.appendChild(element);
    });
  }

  /**
   * Gets a query parameter value from the URL using URLSearchParams
   */
  function getQueryParameter(name: string): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  /**
   * Builds the Lunr search index from the global store
   */
  function buildSearchIndex(store: SearchStore): lunr.Index {
    return lunr(function(): void {
      // Configure search fields with boosts
      this.field('id');
      this.field('title', { boost: CONFIG.TITLE_BOOST });
      this.field('author');
      this.field('category');
      this.field('content');

      // Add all items from the store to the index
      Object.entries(store).forEach(([key, item]) => {
        this.add({
          id: key,
          title: item.title,
          author: item.author ?? '',
          category: item.category ?? '',
          content: item.content,
        });
      });
    });
  }

  /**
   * Performs the search and displays results
   */
  function performSearch(): void {
    const searchTerm = getQueryParameter(CONFIG.SEARCH_PARAM);

    if (!searchTerm) {
      return;
    }

    // Update search box value
    const searchBox = document.getElementById(ELEMENT_IDS.SEARCH_BOX) as HTMLInputElement | null;
    if (searchBox) {
      searchBox.value = searchTerm;
    }

    // Check if store is available
    if (!window.store) {
      console.error('Search store not loaded');
      return;
    }

    try {
      // Build search index and perform search
      const index = buildSearchIndex(window.store);
      const results = index.search(searchTerm);
      
      // Display results
      displaySearchResults(results, window.store);
    } catch (error) {
      console.error('Search error:', error);
      
      const searchResults = document.getElementById(ELEMENT_IDS.RESULTS);
      if (searchResults) {
        searchResults.innerHTML = '<li>An error occurred while searching. Please try again.</li>';
      }
    }
  }

  // Initialize search when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', performSearch);
  } else {
    performSearch();
  }
})();
