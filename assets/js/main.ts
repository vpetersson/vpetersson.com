/**
 * Mobile menu functionality (modern nav) with accessibility
 */
(function initializeMobileMenu(): void {
  'use strict';

  const menuToggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
  const menuPanel = document.querySelector<HTMLElement>('[data-menu-panel]');
  const menuBackdrop = document.querySelector<HTMLElement>('[data-menu-backdrop]');
  const menuClose = document.querySelector<HTMLElement>('[data-menu-close]');
  const menuLinks = document.querySelectorAll<HTMLElement>('.mobile-menu-link');

  if (!menuToggle || !menuPanel || !menuBackdrop || !menuClose) return;

  let isOpen = false;

  function openMenu(): void {
    isOpen = true;
    menuToggle!.setAttribute('aria-expanded', 'true');
    menuPanel!.classList.add('is-open');
    menuBackdrop!.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    const firstLink = menuPanel!.querySelector<HTMLElement>('.mobile-menu-link');
    if (firstLink) firstLink.focus();
  }

  function closeMenu(): void {
    isOpen = false;
    menuToggle!.setAttribute('aria-expanded', 'false');
    menuPanel!.classList.remove('is-open');
    menuBackdrop!.classList.remove('is-visible');
    document.body.style.overflow = '';
    menuToggle!.focus();
  }

  function toggleMenu(): void {
    isOpen ? closeMenu() : openMenu();
  }

  menuToggle.addEventListener('click', toggleMenu);
  menuClose.addEventListener('click', closeMenu);
  menuBackdrop.addEventListener('click', closeMenu);
  menuLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Focus trap within menu panel
  menuPanel.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusable = menuPanel!.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();
