/**
 * Deck name validation and manipulation utilities
 */

/**
 * Find a deck by name (case-insensitive)
 * @param {string} name - Deck name to search for
 * @param {Array} decks - Array of deck objects
 * @returns {Object|null} - Found deck or null
 */
export const findDeckByName = (name, decks) => {
  if (!name || !decks) return null;
  return decks.find(deck =>
    deck.name.toLowerCase() === name.toLowerCase()
  ) || null;
};

/**
 * Check if a deck name is duplicate (case-insensitive)
 * @param {string} name - Deck name to check
 * @param {Array} decks - Array of deck objects
 * @returns {boolean} - True if duplicate exists
 */
export const isDeckNameDuplicate = (name, decks) => {
  return findDeckByName(name, decks) !== null;
};

/**
 * Generate a unique deck name by appending a number suffix
 * @param {string} baseName - Base name to make unique
 * @param {Array} decks - Array of deck objects
 * @returns {string} - Unique deck name with suffix
 */
export const generateUniqueDeckName = (baseName, decks) => {
  if (!isDeckNameDuplicate(baseName, decks)) {
    return baseName;
  }

  let counter = 1;
  let uniqueName = `${baseName} (${counter})`;

  while (isDeckNameDuplicate(uniqueName, decks)) {
    counter++;
    uniqueName = `${baseName} (${counter})`;
  }

  return uniqueName;
};

/**
 * Validate deck name
 * @param {string} name - Deck name to validate
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateDeckName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Deck name cannot be empty' };
  }

  if (name.trim().length > 100) {
    return { valid: false, error: 'Deck name is too long (max 100 characters)' };
  }

  return { valid: true, error: null };
};
