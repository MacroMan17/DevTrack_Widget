// src/utils/cache.js — Simple API response caching

class APICache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   */
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
    console.log(`[Cache] Set: ${key}`);
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if expired/not found
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      console.log(`[Cache] Miss: ${key} (not found)`);
      return null;
    }

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      console.log(`[Cache] Miss: ${key} (expired)`);
      return null;
    }

    console.log(`[Cache] Hit: ${key}`);
    return item.value;
  }

  /**
   * Check if a key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Check if a key is expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  isExpired(key) {
    const item = this.cache.get(key);
    if (!item) return true;
    return Date.now() - item.timestamp > this.ttl;
  }

  /**
   * Clear a specific key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    console.log(`[Cache] Deleted: ${key}`);
  }

  /**
   * Clear all cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`[Cache] Cleared ${size} entries`);
  }

  /**
   * Get cache statistics
   * @returns {object} Cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      ttl: this.ttl,
      entries: Array.from(this.cache.entries()).map(([key, { timestamp }]) => ({
        key,
        age: Date.now() - timestamp,
        expired: Date.now() - timestamp > this.ttl,
      })),
    };
  }
}

// Create singleton instance
export const apiCache = new APICache();

// Export class for testing
export default APICache;
