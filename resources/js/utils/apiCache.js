/**
 * Simple in-memory cache for API responses
 * This helps reduce duplicate API calls and improves performance
 */

// Cache storage
const cache = new Map();

// Default cache expiration time (5 minutes)
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

// Debug flag to log cache operations
const DEBUG_CACHE = false;

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Object|null} - Cached data or null if not found/expired
 */
export const getFromCache = (key) => {
  if (!cache.has(key)) {
    if (DEBUG_CACHE) console.log(`Cache miss: ${key}`);
    return null;
  }

  const cachedData = cache.get(key);
  const now = Date.now();

  // Check if cache has expired
  if (now > cachedData.expiry) {
    if (DEBUG_CACHE) console.log(`Cache expired: ${key}`);
    cache.delete(key);
    return null;
  }

  if (DEBUG_CACHE) console.log(`Cache hit: ${key}`);
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
  if (DEBUG_CACHE) console.log(`Cache set: ${key}, expires in ${expiryTime/1000}s`);
};

/**
 * Clear the entire cache or a specific key
 * @param {string} [key] - Optional key to clear specific cache entry
 */
export const clearCache = (key) => {
  if (key) {
    if (DEBUG_CACHE) console.log(`Cache clear: ${key}`);
    cache.delete(key);
  } else {
    if (DEBUG_CACHE) console.log('Cache clear: all');
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
