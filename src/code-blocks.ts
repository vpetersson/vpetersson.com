/**
 * Progressive enhancement for code blocks
 * Adds copy buttons, language labels, and keyboard shortcuts
 */
(function initializeCodeBlocks(): void {
  'use strict';

  const CONFIG = {
    FEEDBACK_DURATION_MS: 2000,
    DEFAULT_LANGUAGE: 'text',
    KEYBOARD_SHORTCUT: {
      CTRL_KEY: true,
      SHIFT_KEY: true,
      KEY: 'C',
    },
    COLORS: {
      SUCCESS: '#5D5FEF',
      ERROR: '#ef4444',
      TEXT: '#ffffff',
    },
  } as const;

  const SELECTORS = {
    CODE_BLOCKS: 'pre code, .highlight pre code',
    CODE_WRAPPER: '.code-block-wrapper',
    COPY_BUTTON: '.copy-button',
  } as const;

  const CLASSES = {
    COPY_BUTTON: 'copy-button',
    LANGUAGE_LABEL: 'language-label',
    CODE_HEADER: 'code-block-header',
    CODE_WRAPPER: 'code-block-wrapper',
  } as const;

  const LANGUAGE_PATTERN = /language-(\w+)/;

  // Only run if we have code blocks
  const codeBlocks = document.querySelectorAll<HTMLElement>(SELECTORS.CODE_BLOCKS);
  if (!codeBlocks.length) return;

  /**
   * Extracts the programming language from element class names
   */
  function getLanguage(element: HTMLElement): string {
    const classList = element.className || '';
    const match = classList.match(LANGUAGE_PATTERN);
    return match?.[1] ?? CONFIG.DEFAULT_LANGUAGE;
  }

  /**
   * Creates a copy button element with accessibility attributes
   */
  function createCopyButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = CLASSES.COPY_BUTTON;
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    return button;
  }

  /**
   * Creates a language label element
   */
  function createLanguageLabel(language: string): HTMLSpanElement {
    const label = document.createElement('span');
    label.className = CLASSES.LANGUAGE_LABEL;
    label.textContent = language;
    label.setAttribute('aria-label', `Code language: ${language}`);
    return label;
  }

  /**
   * Creates a code block header containing language label and copy button
   */
  function createCodeHeader(language: string, copyButton: HTMLButtonElement): HTMLDivElement {
    const header = document.createElement('div');
    header.className = CLASSES.CODE_HEADER;
    header.appendChild(createLanguageLabel(language));
    header.appendChild(copyButton);
    return header;
  }

  /**
   * Wraps a code block with a container div
   */
  function wrapCodeBlock(preElement: HTMLPreElement, header: HTMLDivElement): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = CLASSES.CODE_WRAPPER;

    const parent = preElement.parentNode;
    if (!parent) {
      throw new Error('Code block has no parent node');
    }

    // Insert wrapper before pre element
    parent.insertBefore(wrapper, preElement);

    // Move pre element into wrapper
    wrapper.appendChild(header);
    wrapper.appendChild(preElement);

    return wrapper;
  }

  /**
   * Copies text to clipboard using modern API with fallback
   */
  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      // Use modern Clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      // Fallback for older browsers or non-secure contexts
      return copyToClipboardFallback(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }

  /**
   * Fallback clipboard copy method for older browsers
   */
  function copyToClipboardFallback(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position:fixed;left:-999999px;top:-999999px;';
    textArea.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(textArea);
    
    try {
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      return result;
    } catch (error) {
      console.error('Fallback copy failed:', error);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }

  /**
   * Shows visual feedback on the copy button
   */
  function showCopyFeedback(button: HTMLButtonElement, success: boolean): void {
    const originalText = button.textContent;
    const originalAriaLabel = button.getAttribute('aria-label');
    
    // Update button state
    button.textContent = success ? 'Copied!' : 'Failed';
    button.setAttribute('aria-label', success ? 'Code copied to clipboard' : 'Copy failed');
    button.style.backgroundColor = success ? CONFIG.COLORS.SUCCESS : CONFIG.COLORS.ERROR;
    button.style.borderColor = success ? CONFIG.COLORS.SUCCESS : CONFIG.COLORS.ERROR;
    button.style.color = CONFIG.COLORS.TEXT;
    button.disabled = true;

    // Reset after delay
    setTimeout(() => {
      button.textContent = originalText;
      if (originalAriaLabel) {
        button.setAttribute('aria-label', originalAriaLabel);
      }
      button.style.backgroundColor = '';
      button.style.borderColor = '';
      button.style.color = '';
      button.disabled = false;
    }, CONFIG.FEEDBACK_DURATION_MS);
  }

  /**
   * Enhances a single code block with copy functionality
   */
  function enhanceCodeBlock(codeElement: HTMLElement): void {
    const preElement = codeElement.closest<HTMLPreElement>('pre');
    if (!preElement || preElement.dataset.enhanced) {
      return;
    }

    // Mark as enhanced to avoid double-processing
    preElement.dataset.enhanced = 'true';

    // Get the language
    const language = getLanguage(codeElement);

    // Create copy button
    const copyButton = createCopyButton();

    // Add copy functionality
    copyButton.addEventListener(
      'click',
      async (event: MouseEvent) => {
        event.preventDefault();
        const code = codeElement.textContent ?? '';
        const success = await copyToClipboard(code);
        showCopyFeedback(copyButton, success);
      },
      { passive: false }
    );

    // Create header
    const header = createCodeHeader(language, copyButton);

    // Wrap the code block
    try {
      wrapCodeBlock(preElement, header);
    } catch (error) {
      console.error('Failed to enhance code block:', error);
    }
  }

  // Process each code block
  codeBlocks.forEach(enhanceCodeBlock);

  /**
   * Handles keyboard shortcuts for code block copying
   */
  function handleKeyboardShortcut(event: KeyboardEvent): void {
    const { CTRL_KEY, SHIFT_KEY, KEY } = CONFIG.KEYBOARD_SHORTCUT;
    
    if (
      (event.ctrlKey || event.metaKey) === CTRL_KEY &&
      event.shiftKey === SHIFT_KEY &&
      event.key === KEY
    ) {
      const focusedElement = document.activeElement;
      const codeBlock = focusedElement?.closest<HTMLElement>(SELECTORS.CODE_WRAPPER);
      
      if (codeBlock) {
        event.preventDefault();
        const copyButton = codeBlock.querySelector<HTMLButtonElement>(SELECTORS.COPY_BUTTON);
        copyButton?.click();
      }
    }
  }

  /**
   * Makes code blocks focusable and accessible for keyboard users
   */
  function makeCodeBlocksAccessible(): void {
    const enhancedBlocks = document.querySelectorAll<HTMLPreElement>(
      `${SELECTORS.CODE_WRAPPER} pre`
    );
    
    enhancedBlocks.forEach((pre) => {
      if (!pre.hasAttribute('tabindex')) {
        pre.setAttribute('tabindex', '0');
        pre.setAttribute('role', 'region');
        pre.setAttribute('aria-label', 'Code block - press Ctrl+Shift+C to copy');
      }
    });
  }

  // Add keyboard shortcut listener
  document.addEventListener('keydown', handleKeyboardShortcut);

  // Make code blocks accessible
  makeCodeBlocksAccessible();
})();
