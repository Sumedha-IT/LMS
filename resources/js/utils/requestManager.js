// Global Request Manager for handling request deduplication and caching
class RequestManager {
  constructor() {
    this.pendingRequests = new Map();
    this.requestCache = new Map();
    this.requestTimestamps = new Map();
    this.minRequestInterval = 1000; // 1 second minimum between requests
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes default cache
  }

  // Generate a unique key for each request
  generateRequestKey(endpoint, options = {}) {
    const params = options.params ? JSON.stringify(options.params) : '';
    const method = options.method || 'GET';
    return `${method}:${endpoint}:${params}`;
  }

  // Check if request is already pending
  isRequestPending(key) {
    return this.pendingRequests.has(key);
  }

  // Get cached data if available and not expired
  getCachedData(key) {
    const cached = this.requestCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    // Remove expired cache
    this.requestCache.delete(key);
    return null;
  }

  // Set cached data
  setCachedData(key, data) {
    this.requestCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Throttle requests with adaptive rate limiting
  async throttleRequest(key) {
    const now = Date.now();
    const lastRequest = this.requestTimestamps.get(key);
    
    if (lastRequest && (now - lastRequest) < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - (now - lastRequest);
      console.log(`Request throttled for ${key}, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requestTimestamps.set(key, now);
  }

  // Enhanced rate limiting for profile completion requests
  async throttleProfileCompletionRequest() {
    const profileCompletionKey = 'profile-completion-rate-limit';
    const now = Date.now();
    const lastRequest = this.requestTimestamps.get(profileCompletionKey);
    
    // Use longer delay for profile completion requests to avoid 429 errors
    const profileCompletionDelay = 2000; // 2 seconds between profile completion requests
    
    if (lastRequest && (now - lastRequest) < profileCompletionDelay) {
      const waitTime = profileCompletionDelay - (now - lastRequest);
      console.log(`Profile completion request throttled, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requestTimestamps.set(profileCompletionKey, now);
  }

  // Execute request with deduplication and caching
  async executeRequest(endpoint, options = {}, requestFn) {
    const key = this.generateRequestKey(endpoint, options);
    
    // Check cache first (for GET requests)
    if (options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      const cachedData = this.getCachedData(key);
      if (cachedData && !options.skipCache) {
        console.log(`Returning cached data for: ${key}`);
        return cachedData;
      }
    }

    // Check if request is already pending
    if (this.isRequestPending(key)) {
      console.log(`Request already pending for: ${key}, waiting for result`);
      return this.pendingRequests.get(key);
    }

    // Throttle request
    await this.throttleRequest(key);

    // Create and store the promise
    const requestPromise = this.makeRequest(key, endpoint, options, requestFn);
    this.pendingRequests.set(key, requestPromise);

    try {
      const result = await requestPromise;
      
      // Cache successful GET requests
      if (options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
        this.setCachedData(key, result);
      }
      
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(key);
    }
  }

  // Make the actual request
  async makeRequest(key, endpoint, options, requestFn) {
    try {
      const result = await requestFn();
      return result;
    } catch (error) {
      // For 429 errors, try to return cached data
      if (error.message === "Too Many Attempts." || error.response?.status === 429) {
        console.warn(`Rate limited for ${key}, returning cached data if available`);
        const cachedData = this.getCachedData(key);
        if (cachedData) {
          console.log(`Returning cached data due to rate limit for: ${key}`);
          return cachedData;
        }
      }
      throw error;
    }
  }

  // Clear cache for specific endpoint or all cache
  clearCache(pattern = null) {
    if (!pattern) {
      this.requestCache.clear();
      console.log('All request cache cleared');
    } else {
      for (const key of this.requestCache.keys()) {
        if (key.includes(pattern)) {
          this.requestCache.delete(key);
        }
      }
      console.log(`Cache cleared for pattern: ${pattern}`);
    }
  }

  // Cancel pending requests
  cancelPendingRequests(pattern = null) {
    if (!pattern) {
      this.pendingRequests.clear();
      console.log('All pending requests cancelled');
    } else {
      for (const key of this.pendingRequests.keys()) {
        if (key.includes(pattern)) {
          this.pendingRequests.delete(key);
        }
      }
      console.log(`Pending requests cancelled for pattern: ${pattern}`);
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      pendingRequests: this.pendingRequests.size,
      cachedRequests: this.requestCache.size,
      totalRequests: this.requestTimestamps.size
    };
  }
}

// Create global instance
const requestManager = new RequestManager();

// Export for use in components
export default requestManager;

// Export utility functions
export const clearAllCache = () => requestManager.clearCache();
export const cancelAllRequests = () => requestManager.cancelPendingRequests();
export const getCacheStats = () => requestManager.getCacheStats();
