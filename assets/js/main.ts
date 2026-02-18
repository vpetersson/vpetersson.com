/**
 * Mobile menu functionality with accessibility improvements
 */
(function initializeMobileMenu(): void {
  'use strict';

  const SELECTORS = {
    OPEN_BUTTON: '.open-menu',
    CLOSE_BUTTON: '.close-menu',
    MENU: '.mobile-menu',
  } as const;

  const CLASSES = {
    HIDDEN: 'hidden',
  } as const;

  const KEYS = {
    ESCAPE: 'Escape',
  } as const;

  /**
   * Opens the mobile menu and sets appropriate ARIA attributes
   */
  function openMenu(menu: HTMLElement, openBtn: HTMLElement): void {
    menu.classList.remove(CLASSES.HIDDEN);
    menu.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    
    // Focus the first focusable element in the menu
    const firstFocusable = menu.querySelector<HTMLElement>(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }

  /**
   * Closes the mobile menu and sets appropriate ARIA attributes
   */
  function closeMenu(menu: HTMLElement, openBtn: HTMLElement): void {
    menu.classList.add(CLASSES.HIDDEN);
    menu.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    
    // Return focus to the open button
    openBtn.focus();
  }

  /**
   * Initialize mobile menu with all event handlers
   */
  function initMobileMenu(): void {
    const openBtn = document.querySelector<HTMLElement>(SELECTORS.OPEN_BUTTON);
    const closeBtn = document.querySelector<HTMLElement>(SELECTORS.CLOSE_BUTTON);
    const menu = document.querySelector<HTMLElement>(SELECTORS.MENU);

    if (!openBtn || !closeBtn || !menu) {
      console.warn('Mobile menu elements not found');
      return;
    }

    // Set initial ARIA attributes
    menu.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.setAttribute('aria-controls', menu.id || 'mobile-menu');

    // Open menu handler
    openBtn.addEventListener('click', () => openMenu(menu, openBtn), { passive: true });

    // Close menu handler
    closeBtn.addEventListener('click', () => closeMenu(menu, openBtn), { passive: true });

    // Close menu on Escape key
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === KEYS.ESCAPE && !menu.classList.contains(CLASSES.HIDDEN)) {
        closeMenu(menu, openBtn);
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as Node;
      if (!menu.classList.contains(CLASSES.HIDDEN) && 
          !menu.contains(target) && 
          !openBtn.contains(target)) {
        closeMenu(menu, openBtn);
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
