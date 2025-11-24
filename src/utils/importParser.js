/**
 * Parses a TSV-like import file content.
 * Handles quoted fields (double quotes escaped by double quotes) and tab separators.
 * Ignores lines starting with #.
 * 
 * @param {string} content - The raw file content
 * @returns {Array<{front: string, back: string}>} - Array of parsed cards
 */
export function parseImportFile(content) {
    const cards = [];
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
        // Skip metadata lines and empty lines
        if (line.trim().startsWith('#') || !line.trim()) {
            continue;
        }

        // Parse the line handling quotes
        const parts = parseLine(line);

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
 * Split by tab, but ignore tabs inside quotes.
 */
function parseLine(line) {
    const fields = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
            currentField += char;
        } else if (char === '\t' && !inQuotes) {
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
