/**
 * Subtle parallax effect for hero section decoration dots
 * Adds mouse-tracking animation to improve visual engagement
 */
(function initializeHeroParallax(): void {
  'use strict';

  const SELECTORS = {
    HERO: '.modern-hero',
    DECORATION_DOTS: '.decoration-dot',
  } as const;

  /**
   * Calculates the normalized mouse position within an element (0-1 range)
   */
  function getNormalizedPosition(
    event: MouseEvent,
    element: HTMLElement
  ): { x: number; y: number } {
    const rect = element.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }

  /**
   * Applies parallax transform to decoration dots based on mouse position
   */
  function applyParallaxEffect(
    dots: NodeListOf<HTMLElement>,
    position: { x: number; y: number }
  ): void {
    dots.forEach((dot, index) => {
      // Increase intensity for each dot layer (creates depth effect)
      const intensity = (index + 1) * 0.5;
      
      // Calculate movement relative to center (0.5, 0.5)
      const moveX = (position.x - 0.5) * intensity;
      const moveY = (position.y - 0.5) * intensity;

      dot.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }

  /**
   * Resets all parallax transforms
   */
  function resetParallaxEffect(dots: NodeListOf<HTMLElement>): void {
    dots.forEach((dot) => {
      dot.style.transform = '';
    });
  }

  /**
   * Initialize parallax effect for hero section
   */
  function initParallax(): void {
    const hero = document.querySelector<HTMLElement>(SELECTORS.HERO);
    const dots = document.querySelectorAll<HTMLElement>(SELECTORS.DECORATION_DOTS);

    if (!hero || !dots.length) {
      return;
    }

    // Apply parallax on mouse move
    hero.addEventListener(
      'mousemove',
      (event: MouseEvent) => {
        const position = getNormalizedPosition(event, hero);
        applyParallaxEffect(dots, position);
      },
      { passive: true }
    );

    // Reset on mouse leave
    hero.addEventListener(
      'mouseleave',
      () => {
        resetParallaxEffect(dots);
      },
      { passive: true }
    );
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }
})();
