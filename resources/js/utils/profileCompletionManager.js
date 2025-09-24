import requestManager from './requestManager';
import axios from 'axios';

// Profile Completion Manager for handling throttled requests
class ProfileCompletionManager {
  constructor() {
    this.batchSize = 5; // Process 5 requests at a time
    this.delayBetweenBatches = 1000; // 1 second delay between batches
    this.retryAttempts = 3;
    this.retryDelay = 2000; // 2 seconds initial retry delay
  }

  // Get user info from cookie
  getUserInfo() {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        return decodeURIComponent(cookieValue);
      }
      return null;
    };

    const userInfo = getCookie('user_info');
    if (!userInfo) return null;

    try {
      return JSON.parse(userInfo);
    } catch (parseError) {
      console.error('Error parsing user info:', parseError);
      return null;
    }
  }

  // Fetch profile completion for a single student with enhanced retry logic
  async fetchStudentProfileCompletion(studentId, retryCount = 0) {
    const userData = this.getUserInfo();
    if (!userData) {
      console.error('User information not found');
      return null;
    }

    // Use enhanced rate limiting for profile completion requests
    await requestManager.throttleProfileCompletionRequest();

    const endpoint = `/api/profile-completion/${studentId}`;
    const options = {
      method: 'GET',
      params: { studentId }
    };

    try {
      const result = await requestManager.executeRequest(
        endpoint,
        options,
        () => axios.get(endpoint, {
          headers: { 'Authorization': `Bearer ${userData.token}` }
        })
      );

      if (result.data && result.data.success) {
        return result.data.data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching profile completion for student ${studentId}:`, error);
      
      // Handle 429 errors with exponential backoff retry
      if (error.response?.status === 429 && retryCount < this.retryAttempts) {
        const delay = this.retryDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Rate limited for student ${studentId}, retrying in ${delay}ms (attempt ${retryCount + 1})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchStudentProfileCompletion(studentId, retryCount + 1);
      }
      
      return null;
    }
  }

  // Fetch profile completion for multiple students using bulk endpoint
  async fetchBatchProfileCompletion(studentIds) {
    const results = {};
    const batches = this.chunkArray(studentIds, 50); // Use 50 as per backend limit

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing profile completion batch ${i + 1}/${batches.length} with ${batch.length} students`);

      try {
        // Try bulk endpoint first
        const bulkResults = await this.fetchBulkProfileCompletion(batch);
        if (bulkResults) {
          Object.assign(results, bulkResults);
        } else {
          // Fallback to individual requests if bulk fails
          const batchPromises = batch.map(async (studentId) => {
            const completionData = await this.fetchStudentProfileCompletion(studentId);
            return { studentId, completionData };
          });

          const batchResults = await Promise.all(batchPromises);
          batchResults.forEach(({ studentId, completionData }) => {
            if (completionData) {
              results[studentId] = completionData;
            }
          });
        }
      } catch (error) {
        console.error(`Error processing batch ${i + 1}:`, error);
      }

      // Add delay between batches (except for the last batch)
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, this.delayBetweenBatches));
      }
    }

    return results;
  }

  // Optimized pagination-aware profile completion fetching
  async fetchBatchProfileCompletionOptimized(studentIds, page, perPage) {
    console.log(`🚀 Optimized fetching: Page ${page}, ${perPage} students, ${studentIds.length} IDs`);
    
    // For small pages (≤10 students), use smaller batch size to avoid rate limiting
    const optimizedBatchSize = perPage <= 10 ? 3 : 5;
    const results = {};
    
    // Filter out already cached data to minimize API calls
    const uncachedStudentIds = studentIds.filter(id => {
      const cached = this.getCachedProfileCompletion(id);
      if (cached) {
        results[id] = cached;
        return false; // Skip this ID as it's already cached
      }
      return true;
    });

    console.log(`📊 Cache hit: ${studentIds.length - uncachedStudentIds.length}/${studentIds.length} students`);
    
    if (uncachedStudentIds.length === 0) {
      console.log(`✅ All ${studentIds.length} students already cached, returning cached data`);
      return results;
    }

    // Process uncached students in smaller, optimized batches
    const batches = this.chunkArray(uncachedStudentIds, optimizedBatchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`🔄 Processing optimized batch ${i + 1}/${batches.length} with ${batch.length} students`);

      try {
        // Try bulk endpoint first for efficiency
        const bulkResults = await this.fetchBulkProfileCompletion(batch);
        if (bulkResults) {
          Object.assign(results, bulkResults);
          console.log(`✅ Bulk fetch successful for batch ${i + 1}`);
        } else {
          // Fallback to sequential individual requests to avoid rate limiting
          console.log(`⚠️ Bulk fetch failed, using sequential fallback for batch ${i + 1}`);
          for (const studentId of batch) {
            try {
              const completionData = await this.fetchStudentProfileCompletion(studentId);
              if (completionData) {
                results[studentId] = completionData;
              }
              // Add small delay between individual requests to prevent rate limiting
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
              console.error(`Error fetching profile completion for student ${studentId}:`, error);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing optimized batch ${i + 1}:`, error);
      }

      // Add delay between batches (longer delay for optimization)
      if (i < batches.length - 1) {
        const delay = perPage <= 10 ? 1000 : 1500; // Longer delay for larger pages
        console.log(`⏳ Waiting ${delay}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log(`🎉 Optimized fetch complete: ${Object.keys(results).length} students processed`);
    return results;
  }

  // Fetch profile completion using bulk endpoint with enhanced rate limiting
  async fetchBulkProfileCompletion(studentIds) {
    const userData = this.getUserInfo();
    if (!userData) {
      console.error('User information not found');
      return null;
    }

    // Use enhanced rate limiting for bulk profile completion requests
    await requestManager.throttleProfileCompletionRequest();

    const endpoint = '/api/profile-completion/bulk';
    const options = {
      method: 'POST',
      params: { user_ids: studentIds }
    };

    try {
      const result = await requestManager.executeRequest(
        endpoint,
        options,
        () => axios.post(endpoint, { user_ids: studentIds }, {
          headers: { 'Authorization': `Bearer ${userData.token}` }
        })
      );

      if (result.data && result.data.success) {
        return result.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching bulk profile completion:', error);
      return null;
    }
  }

  // Utility function to chunk array into smaller arrays
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // Get cached profile completion data
  getCachedProfileCompletion(studentId) {
    const endpoint = `/api/profile-completion/${studentId}`;
    const options = {
      method: 'GET',
      params: { studentId }
    };
    const key = requestManager.generateRequestKey(endpoint, options);
    return requestManager.getCachedData(key);
  }

  // Clear profile completion cache
  clearProfileCompletionCache() {
    requestManager.clearCache('profile-completion');
  }
}

// Create and export singleton instance
const profileCompletionManager = new ProfileCompletionManager();
export default profileCompletionManager;
