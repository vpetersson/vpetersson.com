/**
 * Fetch and display GitHub star counts for project cards
 */
(function initializeGitHubStars(): void {
  'use strict';

  interface GitHubRepo {
    stargazers_count: number;
  }

  const SELECTORS = {
    PROJECT_CARD: '[data-github-repo]',
    STAR_COUNT: '.star-count',
  } as const;

  /**
   * Format star count for display
   * Examples: 123 -> "123", 1234 -> "1.2k", 12345 -> "12.3k"
   */
  function formatStarCount(stars: number): string {
    if (stars >= 1000) {
      return (stars / 1000).toFixed(1) + 'k';
    }
    return stars.toString();
  }

  /**
   * Fetch star count from GitHub API for a single repository
   * Uses localStorage caching to reduce API calls (1 hour cache)
   */
  async function fetchStarCount(repo: string): Promise<number | null> {
    const cacheKey = `github-stars-${repo}`;
    const cacheTimeKey = `github-stars-time-${repo}`;
    const cacheLifetime = 3600000; // 1 hour in milliseconds

    // Check cache first
    const cachedStars = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);
    
    if (cachedStars && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      if (age < cacheLifetime) {
        return parseInt(cachedStars, 10);
      }
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`);
      
      if (!response.ok) {
        console.warn(`Failed to fetch stars for ${repo}: ${response.status}`);
        // Return cached value even if expired, better than nothing
        return cachedStars ? parseInt(cachedStars, 10) : null;
      }

      const data = await response.json() as GitHubRepo;
      const stars = data.stargazers_count;
      
      // Cache the result
      localStorage.setItem(cacheKey, stars.toString());
      localStorage.setItem(cacheTimeKey, Date.now().toString());
      
      return stars;
    } catch (error) {
      console.error(`Error fetching stars for ${repo}:`, error);
      // Return cached value on error
      return cachedStars ? parseInt(cachedStars, 10) : null;
    }
  }

  /**
   * Update star count in the DOM
   */
  function updateStarCount(element: HTMLElement, stars: number | null): void {
    if (stars === null) {
      element.textContent = '—';
      return;
    }
    
    element.textContent = formatStarCount(stars);
  }

  /**
   * Process all project cards and fetch their star counts
   */
  async function loadStarCounts(): Promise<void> {
    const projectCards = document.querySelectorAll<HTMLElement>(SELECTORS.PROJECT_CARD);
    
    if (projectCards.length === 0) {
      return;
    }

    // Process all cards in parallel
    const fetchPromises = Array.from(projectCards).map(async (card) => {
      const repo = card.getAttribute('data-github-repo');
      const starCountElement = card.querySelector<HTMLElement>(SELECTORS.STAR_COUNT);

      if (!repo || !starCountElement) {
        return;
      }

      const stars = await fetchStarCount(repo);
      updateStarCount(starCountElement, stars);
    });

    await Promise.all(fetchPromises);
  }

  /**
   * Initialize GitHub stars fetching
   */
  function init(): void {
    // Only run on pages that have project cards
    const hasProjectCards = document.querySelector(SELECTORS.PROJECT_CARD) !== null;
    
    if (!hasProjectCards) {
      return;
    }

    loadStarCounts().catch((error) => {
      console.error('Failed to load GitHub star counts:', error);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
