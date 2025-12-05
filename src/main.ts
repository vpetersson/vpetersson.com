(function() {
  /**
   * Toggle hamburger menu
   */
  function initMobileMenu(): void {
    const openBtn = document.querySelector<HTMLElement>('.open-menu');
    const closeBtn = document.querySelector<HTMLElement>('.close-menu');
    const menu = document.querySelector<HTMLElement>('.mobile-menu');

    if (!openBtn || !closeBtn || !menu) {
      return;
    }

    openBtn.addEventListener('click', () => {
      menu.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  }

  initMobileMenu();
})();
