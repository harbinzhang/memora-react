/**
 * Detects the delimiter used in the file (tab or comma).
 * Checks the first non-comment, non-empty line.
 * Prioritizes tab detection for backward compatibility.
 *
 * @param {string} content - The raw file content
 * @returns {string} - The detected delimiter ('\t' or ',')
 */
function detectDelimiter(content) {
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
        // Skip comments and empty lines
        if (line.trim().startsWith('#') || !line.trim()) {
            continue;
        }

        // Check for tab first (backward compatibility)
        if (line.includes('\t')) {
            return '\t';
        }

        // Fall back to comma
        if (line.includes(',')) {
            return ',';
        }

        // If first data line has neither, default to tab
        return '\t';
    }

    // Default to tab if no data lines found
    return '\t';
}

/**
 * Parses a TSV or CSV import file content.
 * Handles quoted fields (double quotes escaped by double quotes).
 * Supports both tab and comma separators with auto-detection.
 * Ignores lines starting with #.
 *
 * @param {string} content - The raw file content
 * @returns {Array<{front: string, back: string}>} - Array of parsed cards
 */
export function parseImportFile(content) {
    const cards = [];
    const lines = content.split(/\r?\n/);

    // Detect delimiter from file content
    const delimiter = detectDelimiter(content);

    for (const line of lines) {
        // Skip metadata lines and empty lines
        if (line.trim().startsWith('#') || !line.trim()) {
            continue;
        }

        // Parse the line handling quotes with detected delimiter
        const parts = parseLine(line, delimiter);

        if (parts.length >= 2) {
            // Unquote and unescape double quotes
            const front = unescapeField(parts[0]);
            const back = unescapeField(parts[1]);

            if (front && back) {
                cards.push({ front, back });
            }
        }
    }

    return cards;
}

/**
 * Parses a single line into fields, respecting quotes.
 * Splits by the specified delimiter, but ignores delimiters inside quotes.
 *
 * @param {string} line - The line to parse
 * @param {string} delimiter - The delimiter to use ('\t' or ',')
 * @returns {Array<string>} - Array of field values
 */
function parseLine(line, delimiter = '\t') {
    const fields = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
            currentField += char;
        } else if (char === delimiter && !inQuotes) {
            fields.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }

    fields.push(currentField);
    return fields;
}

/**
 * Removes surrounding quotes and unescapes double quotes ("" -> ")
 */
function unescapeField(field) {
    let text = field.trim();

    // Check if it's a quoted string
    if (text.startsWith('"') && text.endsWith('"') && text.length >= 2) {
        text = text.substring(1, text.length - 1);
        // Replace double double-quotes with single double-quote
        text = text.replace(/""/g, '"');
    }

    return text;
}
