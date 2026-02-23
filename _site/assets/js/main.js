// src/main.ts
(function initializeMobileMenu() {
  const SELECTORS = {
    OPEN_BUTTON: ".open-menu",
    CLOSE_BUTTON: ".close-menu",
    MENU: ".mobile-menu"
  };
  const CLASSES = {
    HIDDEN: "hidden"
  };
  const KEYS = {
    ESCAPE: "Escape"
  };
  function openMenu(menu, openBtn) {
    menu.classList.remove(CLASSES.HIDDEN);
    menu.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
    const firstFocusable = menu.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
    firstFocusable?.focus();
  }
  function closeMenu(menu, openBtn) {
    menu.classList.add(CLASSES.HIDDEN);
    menu.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.focus();
  }
  function initMobileMenu() {
    const openBtn = document.querySelector(SELECTORS.OPEN_BUTTON);
    const closeBtn = document.querySelector(SELECTORS.CLOSE_BUTTON);
    const menu = document.querySelector(SELECTORS.MENU);
    if (!openBtn || !closeBtn || !menu) {
      console.warn("Mobile menu elements not found");
      return;
    }
    menu.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.setAttribute("aria-controls", menu.id || "mobile-menu");
    openBtn.addEventListener("click", () => openMenu(menu, openBtn), { passive: true });
    closeBtn.addEventListener("click", () => closeMenu(menu, openBtn), { passive: true });
    document.addEventListener("keydown", (event) => {
      if (event.key === KEYS.ESCAPE && !menu.classList.contains(CLASSES.HIDDEN)) {
        closeMenu(menu, openBtn);
      }
    });
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!menu.classList.contains(CLASSES.HIDDEN) && !menu.contains(target) && !openBtn.contains(target)) {
        closeMenu(menu, openBtn);
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
