// Progressive enhancement for code blocks
(function() {
  'use strict';

  // Only run if we have code blocks
  const codeBlocks = document.querySelectorAll<HTMLElement>('pre code, .highlight pre code');
  if (!codeBlocks.length) return;

  // Function to get language from class names
  function getLanguage(element: HTMLElement): string {
    const classList = element.className || '';
    const match = classList.match(/language-(\w+)/);
    return match ? match[1] : 'text';
  }

  // Function to create copy button
  function createCopyButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    return button;
  }

  // Function to create language label
  function createLanguageLabel(language: string): HTMLSpanElement {
    const label = document.createElement('span');
    label.className = 'language-label';
    label.textContent = language;
    return label;
  }

  // Function to create code block header
  function createCodeHeader(language: string, copyButton: HTMLButtonElement): HTMLDivElement {
    const header = document.createElement('div');
    header.className = 'code-block-header';
    header.appendChild(createLanguageLabel(language));
    header.appendChild(copyButton);
    return header;
  }

  // Function to wrap code block
  function wrapCodeBlock(preElement: HTMLPreElement, header: HTMLDivElement): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    // Insert wrapper before pre element
    preElement.parentNode?.insertBefore(wrapper, preElement);

    // Move pre element into wrapper
    wrapper.appendChild(header);
    wrapper.appendChild(preElement);

    return wrapper;
  }

  // Function to copy text to clipboard
  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return result;
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }

  // Function to show copy feedback
  function showCopyFeedback(button: HTMLButtonElement, success: boolean): void {
    const originalText = button.textContent;
    button.textContent = success ? 'Copied!' : 'Failed';
    button.style.background = success ? '#5D5FEF' : '#ef4444';
    button.style.borderColor = success ? '#5D5FEF' : '#ef4444';
    button.style.color = '#ffffff';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.style.borderColor = '';
      button.style.color = '';
    }, 2000);
  }

  // Process each code block
  codeBlocks.forEach((codeElement) => {
    const preElement = codeElement.closest<HTMLPreElement>('pre');
    if (!preElement || preElement.dataset.enhanced) return;

    // Mark as enhanced to avoid double-processing
    preElement.dataset.enhanced = 'true';

    // Get the language
    const language = getLanguage(codeElement);

    // Create copy button
    const copyButton = createCopyButton();

    // Add copy functionality
    copyButton.addEventListener('click', async () => {
      const code = codeElement.textContent || codeElement.innerText || '';
      const success = await copyToClipboard(code);
      showCopyFeedback(copyButton, success);
    });

    // Create header
    const header = createCodeHeader(language, copyButton);

    // Wrap the code block
    wrapCodeBlock(preElement, header);
  });

  // Add keyboard shortcut for copying (Ctrl/Cmd + Shift + C when focused on code block)
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      const focusedElement = document.activeElement;
      const codeBlock = focusedElement?.closest<HTMLElement>('.code-block-wrapper');
      if (codeBlock) {
        e.preventDefault();
        const copyButton = codeBlock.querySelector<HTMLButtonElement>('.copy-button');
        if (copyButton) copyButton.click();
      }
    }
  });

  // Make code blocks focusable for keyboard users
  document.querySelectorAll<HTMLPreElement>('.code-block-wrapper pre').forEach(pre => {
    if (!pre.hasAttribute('tabindex')) {
      pre.setAttribute('tabindex', '0');
      pre.setAttribute('aria-label', 'Code block - press Ctrl+Shift+C to copy');
    }
  });
})();
