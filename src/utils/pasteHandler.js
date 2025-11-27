import DOMPurify from 'dompurify';

/**
 * Processes paste events to convert rich formatted text into HTML
 * @param {ClipboardEvent} e - The paste event
 * @param {Function} setValue - React setState function to update the textarea value
 */
export function handleRichTextPaste(e, setValue) {
  // Prevent default paste behavior
  e.preventDefault();

  // Get clipboard data
  const clipboardData = e.clipboardData || window.clipboardData;
  const textarea = e.target;

  // Try to get HTML content first
  let htmlContent = clipboardData.getData('text/html');
  const plainText = clipboardData.getData('text/plain');

  // Process content (HTML or plain text)
  let processedText;
  if (!htmlContent || htmlContent.trim() === '') {
    // No HTML content, just escape plain text
    processedText = escapeHtmlEntities(plainText);
  } else {
    // Process HTML content
    processedText = processClipboardHtml(htmlContent);
  }

  // Get current value and cursor position
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const currentValue = textarea.value;

  // Build new value with processed text inserted at cursor
  const newValue = currentValue.substring(0, start) + processedText + currentValue.substring(end);

  // Update React state via callback
  setValue(newValue);

  // Set cursor position after React updates
  // Use setTimeout to ensure cursor is set AFTER React re-renders
  setTimeout(() => {
    const newCursorPos = start + processedText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  }, 0);
}

/**
 * Process clipboard HTML and convert to safe HTML tags
 * @param {string} html - Raw HTML from clipboard
 * @returns {string} - Processed HTML as text
 */
function processClipboardHtml(html) {
  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Convert DOM to our safe HTML tags
  const result = processNode(doc.body);

  // Clean with DOMPurify and return as HTML source (not rendered)
  const cleanHtml = DOMPurify.sanitize(result, {
    ALLOWED_TAGS: ['div', 'span', 'br', 'p', 'strong', 'em', 'u', 'code', 'pre', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  return cleanHtml.trim();
}

/**
 * Recursively process DOM nodes and convert to HTML string
 * @param {Node} node - DOM node to process
 * @returns {string} - HTML string
 */
function processNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Escape special characters in text nodes
    return escapeHtmlEntities(node.textContent);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const tagName = node.tagName.toLowerCase();
  let html = '';

  // Process child nodes
  const childContent = Array.from(node.childNodes)
    .map(child => processNode(child))
    .join('');

  // Map common HTML tags to our supported tags
  switch (tagName) {
    case 'strong':
    case 'b':
      html = `<strong>${childContent}</strong>`;
      break;
    case 'em':
    case 'i':
      html = `<em>${childContent}</em>`;
      break;
    case 'u':
      html = `<u>${childContent}</u>`;
      break;
    case 'code':
      html = `<code>${childContent}</code>`;
      break;
    case 'pre':
      html = `<pre>${childContent}</pre>`;
      break;
    case 'ul':
      html = `<ul>${childContent}</ul>`;
      break;
    case 'ol':
      html = `<ol>${childContent}</ol>`;
      break;
    case 'li':
      html = `<li>${childContent}</li>`;
      break;
    case 'div':
    case 'p':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      // Convert headings and paragraphs to divs
      html = `<div>${childContent}</div>`;
      break;
    case 'br':
      html = '<br>';
      break;
    case 'span':
      // Keep spans only if they have content
      html = childContent ? `<span>${childContent}</span>` : childContent;
      break;
    case 'body':
    case 'html':
      // Just return child content for body/html
      html = childContent;
      break;
    default:
      // For unsupported tags, just keep the content
      html = childContent;
  }

  return html;
}

/**
 * Escape HTML entities
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtmlEntities(text) {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
