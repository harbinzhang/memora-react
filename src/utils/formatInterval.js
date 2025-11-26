/**
 * Formats a time interval (in days) into a human-readable string
 *
 * @param {number} days - The interval in days (can be fractional for sub-day intervals)
 * @returns {string} Formatted interval string (e.g., '15m', '2h', '5d', '2mo', '1y')
 */
export const formatInterval = (days) => {
    if (days === 0) return '< 1m';

    // Handle sub-day intervals (minutes and hours)
    if (days < 1) {
        const totalMinutes = Math.round(days * 24 * 60);

        // Less than 1 hour: show minutes
        if (totalMinutes < 60) {
            return `${totalMinutes}m`;
        }

        // 1+ hours but less than 1 day: show hours
        const hours = Math.round(totalMinutes / 60);
        return `${hours}h`;
    }

    // Handle day-level intervals
    if (days >= 365) return `${(days / 365).toFixed(1)}y`;
    if (days >= 30) return `${(days / 30).toFixed(1)}mo`;
    return `${Math.round(days)}d`;
};
