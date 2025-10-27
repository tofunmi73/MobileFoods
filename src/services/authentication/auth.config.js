
export const INACTIVITY_TIMEOUT_MINUTES = 30;

/**
 * Convert to milliseconds for internal use
 */
export const INACTIVITY_TIMEOUT = INACTIVITY_TIMEOUT_MINUTES * 60 * 1000;

/**
 * AsyncStorage key for storing last active timestamp
 */
export const LAST_ACTIVE_KEY = "@last_active_timestamp";
