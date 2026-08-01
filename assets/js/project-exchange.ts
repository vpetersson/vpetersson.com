/**
 * Drive the input/output exchange on a project page.
 *
 * Selecting a row on the left swaps the matching response on the right. The one
 * live row calls the project's own running instance, and only when the visitor
 * asks it to: nothing is fetched on page load.
 */
(function initializeProjectExchange(): void {
  'use strict';

  const SELECTORS = {
    EXCHANGE: '[data-exchange]',
    ROW: '.exchange-row',
    OUT_BLOCK: '.exchange-out-block',
  } as const;

  const LIVE_ROW = 'live';
  const LIVE_TIMEOUT = 8000;

  /** Show the response block belonging to `id`, hide the rest. */
  function showBlock(exchange: HTMLElement, id: string): void {
    const blocks = exchange.querySelectorAll<HTMLElement>(SELECTORS.OUT_BLOCK);
    blocks.forEach((block) => {
      block.hidden = block.getAttribute('data-for') !== id;
    });
  }

  /** Mark the selected row, unmark the others. */
  function markRow(exchange: HTMLElement, selected: HTMLElement): void {
    const rows = exchange.querySelectorAll<HTMLElement>(SELECTORS.ROW);
    rows.forEach((row) => {
      if (row === selected) {
        row.setAttribute('aria-current', 'true');
      } else {
        row.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Call the live instance for the visitor's own address and print the result.
   * Failures are reported as what they are, rather than swallowed.
   */
  async function runLiveLookup(exchange: HTMLElement, endpoint: string): Promise<void> {
    const target = exchange.querySelector<HTMLElement>(
      `${SELECTORS.OUT_BLOCK}[data-for="${LIVE_ROW}"] code`
    );

    if (!target) {
      return;
    }

    target.textContent = 'Calling ' + endpoint + ' ...';

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), LIVE_TIMEOUT);

    try {
      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        target.textContent =
          'The instance answered ' +
          response.status +
          '. The examples above are real responses recorded earlier.';
        return;
      }

      const data: unknown = await response.json();
      target.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === 'AbortError';
      target.textContent = aborted
        ? 'The lookup timed out after ' + LIVE_TIMEOUT / 1000 + ' seconds.'
        : 'The lookup could not reach the instance. It may be down, or a blocker stopped the request.';
    } finally {
      window.clearTimeout(timer);
    }
  }

  function init(): void {
    const exchanges = document.querySelectorAll<HTMLElement>(SELECTORS.EXCHANGE);

    exchanges.forEach((exchange) => {
      const rows = exchange.querySelectorAll<HTMLElement>(SELECTORS.ROW);

      rows.forEach((row) => {
        row.addEventListener('click', () => {
          const id = row.getAttribute('data-row');

          if (!id) {
            return;
          }

          markRow(exchange, row);
          showBlock(exchange, id);

          if (id === LIVE_ROW) {
            const endpoint = row.getAttribute('data-endpoint');

            if (endpoint) {
              runLiveLookup(exchange, endpoint).catch(() => {
                /* reported in the block itself */
              });
            }
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
