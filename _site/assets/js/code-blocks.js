// src/code-blocks.ts
(function initializeCodeBlocks() {
  const CONFIG = {
    FEEDBACK_DURATION_MS: 2000,
    DEFAULT_LANGUAGE: "text",
    KEYBOARD_SHORTCUT: {
      CTRL_KEY: true,
      SHIFT_KEY: true,
      KEY: "C"
    },
    COLORS: {
      SUCCESS: "#5D5FEF",
      ERROR: "#ef4444",
      TEXT: "#ffffff"
    }
  };
  const SELECTORS = {
    CODE_BLOCKS: "pre code, .highlight pre code",
    CODE_WRAPPER: ".code-block-wrapper",
    COPY_BUTTON: ".copy-button"
  };
  const CLASSES = {
    COPY_BUTTON: "copy-button",
    LANGUAGE_LABEL: "language-label",
    CODE_HEADER: "code-block-header",
    CODE_WRAPPER: "code-block-wrapper"
  };
  const LANGUAGE_PATTERN = /language-(\w+)/;
  const codeBlocks = document.querySelectorAll(SELECTORS.CODE_BLOCKS);
  if (!codeBlocks.length)
    return;
  function getLanguage(element) {
    const classList = element.className || "";
    const match = classList.match(LANGUAGE_PATTERN);
    return match?.[1] ?? CONFIG.DEFAULT_LANGUAGE;
  }
  function createCopyButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = CLASSES.COPY_BUTTON;
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code to clipboard");
    return button;
  }
  function createLanguageLabel(language) {
    const label = document.createElement("span");
    label.className = CLASSES.LANGUAGE_LABEL;
    label.textContent = language;
    label.setAttribute("aria-label", `Code language: ${language}`);
    return label;
  }
  function createCodeHeader(language, copyButton) {
    const header = document.createElement("div");
    header.className = CLASSES.CODE_HEADER;
    header.appendChild(createLanguageLabel(language));
    header.appendChild(copyButton);
    return header;
  }
  function wrapCodeBlock(preElement, header) {
    const wrapper = document.createElement("div");
    wrapper.className = CLASSES.CODE_WRAPPER;
    const parent = preElement.parentNode;
    if (!parent) {
      throw new Error("Code block has no parent node");
    }
    parent.insertBefore(wrapper, preElement);
    wrapper.appendChild(header);
    wrapper.appendChild(preElement);
    return wrapper;
  }
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      return copyToClipboardFallback(text);
    } catch (error) {
      console.error("Failed to copy text:", error);
      return false;
    }
  }
  function copyToClipboardFallback(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.cssText = "position:fixed;left:-999999px;top:-999999px;";
    textArea.setAttribute("aria-hidden", "true");
    document.body.appendChild(textArea);
    try {
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      return result;
    } catch (error) {
      console.error("Fallback copy failed:", error);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
  function showCopyFeedback(button, success) {
    const originalText = button.textContent;
    const originalAriaLabel = button.getAttribute("aria-label");
    button.textContent = success ? "Copied!" : "Failed";
    button.setAttribute("aria-label", success ? "Code copied to clipboard" : "Copy failed");
    button.style.backgroundColor = success ? CONFIG.COLORS.SUCCESS : CONFIG.COLORS.ERROR;
    button.style.borderColor = success ? CONFIG.COLORS.SUCCESS : CONFIG.COLORS.ERROR;
    button.style.color = CONFIG.COLORS.TEXT;
    button.disabled = true;
    setTimeout(() => {
      button.textContent = originalText;
      if (originalAriaLabel) {
        button.setAttribute("aria-label", originalAriaLabel);
      }
      button.style.backgroundColor = "";
      button.style.borderColor = "";
      button.style.color = "";
      button.disabled = false;
    }, CONFIG.FEEDBACK_DURATION_MS);
  }
  function enhanceCodeBlock(codeElement) {
    const preElement = codeElement.closest("pre");
    if (!preElement || preElement.dataset.enhanced) {
      return;
    }
    preElement.dataset.enhanced = "true";
    const language = getLanguage(codeElement);
    const copyButton = createCopyButton();
    copyButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const code = codeElement.textContent ?? "";
      const success = await copyToClipboard(code);
      showCopyFeedback(copyButton, success);
    }, { passive: false });
    const header = createCodeHeader(language, copyButton);
    try {
      wrapCodeBlock(preElement, header);
    } catch (error) {
      console.error("Failed to enhance code block:", error);
    }
  }
  codeBlocks.forEach(enhanceCodeBlock);
  function handleKeyboardShortcut(event) {
    const { CTRL_KEY, SHIFT_KEY, KEY } = CONFIG.KEYBOARD_SHORTCUT;
    if ((event.ctrlKey || event.metaKey) === CTRL_KEY && event.shiftKey === SHIFT_KEY && event.key === KEY) {
      const focusedElement = document.activeElement;
      const codeBlock = focusedElement?.closest(SELECTORS.CODE_WRAPPER);
      if (codeBlock) {
        event.preventDefault();
        const copyButton = codeBlock.querySelector(SELECTORS.COPY_BUTTON);
        copyButton?.click();
      }
    }
  }
  function makeCodeBlocksAccessible() {
    const enhancedBlocks = document.querySelectorAll(`${SELECTORS.CODE_WRAPPER} pre`);
    enhancedBlocks.forEach((pre) => {
      if (!pre.hasAttribute("tabindex")) {
        pre.setAttribute("tabindex", "0");
        pre.setAttribute("role", "region");
        pre.setAttribute("aria-label", "Code block - press Ctrl+Shift+C to copy");
      }
    });
  }
  document.addEventListener("keydown", handleKeyboardShortcut);
  makeCodeBlocksAccessible();
})();
