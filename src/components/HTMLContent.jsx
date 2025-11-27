import DOMPurify from 'dompurify';

/**
 * HTMLContent Component
 *
 * Safely renders HTML content with sanitization to prevent XSS attacks.
 * Only allows safe formatting tags: div, span, br, p, strong, em, u, code, pre, ul, ol, li
 *
 * @param {string} content - The HTML content to render
 * @param {string} className - Optional CSS classes to apply
 */
export default function HTMLContent({ content, className = '' }) {
  // Configure DOMPurify to only allow safe formatting tags
  const sanitizeConfig = {
    ALLOWED_TAGS: [
      'div', 'span', 'br', 'p',
      'strong', 'em', 'u',
      'code', 'pre',
      'ul', 'ol', 'li'
    ],
    ALLOWED_ATTR: [], // No attributes allowed for maximum security
    KEEP_CONTENT: true, // Keep text content even if tags are removed
  };

  // Sanitize the HTML content
  const sanitizedContent = DOMPurify.sanitize(content, sanitizeConfig);

  return (
    <div
      className={`html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
