/**
 * Simple in-memory cache for API responses
 * This helps reduce duplicate API calls and improves performance
 */

// Cache storage
const cache = new Map();

// Default cache expiration time (5 minutes)
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Object|null} - Cached data or null if not found/expired
 */
export const getFromCache = (key) => {
  if (!cache.has(key)) {
    return null;
  }

  const cachedData = cache.get(key);
  const now = Date.now();

  // Check if cache has expired
  if (now > cachedData.expiry) {
    cache.delete(key);
    return null;
  }

  return cachedData.data;
};

/**
 * Save data to cache
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 * @param {number} [expiryTime=DEFAULT_CACHE_TIME] - Cache expiration time in milliseconds
 */
export const saveToCache = (key, data, expiryTime = DEFAULT_CACHE_TIME) => {
  const expiry = Date.now() + expiryTime;
  cache.set(key, { data, expiry });
};

/**
 * Clear the entire cache or a specific key
 * @param {string} [key] - Optional key to clear specific cache entry
 */
export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

/**
 * Get cache size
 * @returns {number} - Number of items in cache
 */
export const getCacheSize = () => {
  return cache.size;
};
