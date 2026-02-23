// src/hero-parallax.ts
(function initializeHeroParallax() {
  const SELECTORS = {
    HERO: ".modern-hero",
    DECORATION_DOTS: ".decoration-dot"
  };
  function getNormalizedPosition(event, element) {
    const rect = element.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height
    };
  }
  function applyParallaxEffect(dots, position) {
    dots.forEach((dot, index) => {
      const intensity = (index + 1) * 0.5;
      const moveX = (position.x - 0.5) * intensity;
      const moveY = (position.y - 0.5) * intensity;
      dot.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }
  function resetParallaxEffect(dots) {
    dots.forEach((dot) => {
      dot.style.transform = "";
    });
  }
  function initParallax() {
    const hero = document.querySelector(SELECTORS.HERO);
    const dots = document.querySelectorAll(SELECTORS.DECORATION_DOTS);
    if (!hero || !dots.length) {
      return;
    }
    hero.addEventListener("mousemove", (event) => {
      const position = getNormalizedPosition(event, hero);
      applyParallaxEffect(dots, position);
    }, { passive: true });
    hero.addEventListener("mouseleave", () => {
      resetParallaxEffect(dots);
    }, { passive: true });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParallax);
  } else {
    initParallax();
  }
})();
