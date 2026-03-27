import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, // 10 second timeout
});

// 🔥 REQUEST INTERCEPTOR: Add token and handle retries
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Mark first attempt
    if (!config.retryCount) {
      config.retryCount = 0;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 RESPONSE INTERCEPTOR: Handle errors and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Only retry non-login requests and network/timeout errors
    const isLoginRequest = config.url.includes('/auth/login');
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND';
    const isServerError = error.response?.status >= 500;
    const shouldRetry = !isLoginRequest && (isNetworkError || isServerError) && config.retryCount < 2;

    if (shouldRetry) {
      config.retryCount++;
      console.log(`🔄 Retry attempt ${config.retryCount} for ${config.method} ${config.url}`);
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retryCount));
      return api(config);
    }

    // Handle 401 Unauthorized (but not on login requests)
    if (error.response?.status === 401) {
      // Only redirect if it's not a login request
      if (!isLoginRequest) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    // Log error details for debugging
    if (error.response?.status >= 500) {
      console.error(`❌ Server error ${error.response.status}:`, error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error(`⏱️ Request timeout for ${config.method} ${config.url}`);
    } else if (!error.response) {
      console.error(`🌐 Network error: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default api;