/**
 * Spaced Repetition System (SRS) Configuration
 *
 * This file contains all configurable parameters for the SRS algorithm.
 * Modify these values to customize the learning experience.
 */

// ============================================================================
// FIRST REVIEW INTERVALS (for cards with interval = 0)
// ============================================================================
// All values in MINUTES for fine granularity

export const FIRST_REVIEW_INTERVALS = {
  // Grade 1-2: Again - User doesn't know the card at all
  AGAIN: 15,        // 15 minutes

  // Grade 3: Hard - User struggled with the card
  HARD: 15,         // 15 minutes

  // Grade 4: Good - User recalled correctly with some effort
  GOOD: 60,         // 1 hour

  // Grade 5: Easy - User recalled instantly and effortlessly
  EASY: 1440,       // 1 day (24 hours * 60 minutes)
};

// ============================================================================
// SUBSEQUENT REVIEW MULTIPLIERS (for cards with interval > 0)
// ============================================================================
// Applied to current interval to calculate next interval

export const MULTIPLIERS = {
  // Grade 3: Hard - Reduce progression speed
  HARD: 1.2,        // Increase interval by 20%

  // Grade 4: Good - Normal progression
  GOOD: 2.0,        // Double the interval

  // Grade 5: Easy - Fast progression
  EASY: 3.0,        // Triple the interval
};

// ============================================================================
// INTERVAL CONSTRAINTS
// ============================================================================

// Maximum review interval (in days)
// Cards won't be scheduled beyond this many days in the future
export const MAX_INTERVAL = 365;  // 1 year

// Minimum interval (in days) - mostly for safety
export const MIN_INTERVAL = 0;

// ============================================================================
// FLEXIBILITY SETTINGS
// ============================================================================

// Percentage of interval that allows early review
// Example: 0.2 = 20% = can review a card 20% before its due date
export const FLEXIBILITY_WINDOW = 0.2;

// ============================================================================
// INITIAL CARD STATE
// ============================================================================

// Default ease factor for new cards (SM-2 compatible, but unused in current algorithm)
export const DEFAULT_EASE_FACTOR = 2.5;

// Initial interval for new cards (in days)
export const INITIAL_INTERVAL = 0;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert minutes to days (fractional)
 * @param {number} minutes - Number of minutes
 * @returns {number} Number of days (can be fractional for sub-day intervals)
 */
export const minutesToDays = (minutes) => {
  return minutes / (24 * 60);
};

/**
 * Convert days to minutes
 * @param {number} days - Number of days
 * @returns {number} Number of minutes
 */
export const daysToMinutes = (days) => {
  return days * 24 * 60;
};

/**
 * Get the first review interval in days based on grade
 * @param {number} grade - Review grade (1-5)
 * @returns {number} Interval in days (fractional for sub-day intervals)
 */
export const getFirstReviewInterval = (grade) => {
  let minutes;

  if (grade < 3) {
    // Again
    minutes = FIRST_REVIEW_INTERVALS.AGAIN;
  } else if (grade === 3) {
    // Hard
    minutes = FIRST_REVIEW_INTERVALS.HARD;
  } else if (grade === 4) {
    // Good
    minutes = FIRST_REVIEW_INTERVALS.GOOD;
  } else {
    // Easy (grade 5)
    minutes = FIRST_REVIEW_INTERVALS.EASY;
  }

  return minutesToDays(minutes);
};

/**
 * Get the multiplier for subsequent reviews based on grade
 * @param {number} grade - Review grade (3-5)
 * @returns {number} Multiplier to apply to current interval
 */
export const getMultiplier = (grade) => {
  if (grade === 3) return MULTIPLIERS.HARD;
  if (grade === 4) return MULTIPLIERS.GOOD;
  return MULTIPLIERS.EASY;
};

/**
 * Calculate the next interval based on current interval and grade
 * @param {number} currentInterval - Current interval in days
 * @param {number} grade - Review grade (1-5)
 * @returns {number} Next interval in days, capped at MAX_INTERVAL
 */
export const calculateInterval = (currentInterval, grade) => {
  let newInterval;

  // Grade < 3 (Again) resets to 0, triggering first review intervals next time
  if (grade < 3) {
    newInterval = 0;
  }
  // First review (interval = 0) uses configured first review intervals
  else if (currentInterval === 0) {
    newInterval = getFirstReviewInterval(grade);
  }
  // Subsequent reviews apply multipliers
  else {
    const multiplier = getMultiplier(grade);
    newInterval = currentInterval * multiplier;
  }

  // Cap at maximum interval
  return Math.min(newInterval, MAX_INTERVAL);
};

// ============================================================================
// EXPORT DEFAULT CONFIG OBJECT
// ============================================================================

export default {
  FIRST_REVIEW_INTERVALS,
  MULTIPLIERS,
  MAX_INTERVAL,
  MIN_INTERVAL,
  FLEXIBILITY_WINDOW,
  DEFAULT_EASE_FACTOR,
  INITIAL_INTERVAL,

  // Helper functions
  minutesToDays,
  daysToMinutes,
  getFirstReviewInterval,
  getMultiplier,
  calculateInterval,
};
