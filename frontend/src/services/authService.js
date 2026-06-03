import api from "./api";

const extractData = (response) => {
  console.log("=== EXTRACT DATA ANALYSIS ===");
  console.log("Raw response:", response);
  console.log("Response data:", response.data);
  
  if (!response?.data) {
    console.log("❌ No response.data");
    return {};
  }
  
  // Format 1: {success: true, data: {...}}
  if (response.data.success && response.data.data) {
    console.log("✅ Format 1 detected: {success, data}");
    return response.data.data;
  }
  
  // Format 2: {data: {...}} (sans success)
  if (response.data.data && typeof response.data.data === 'object') {
    console.log("✅ Format 2 detected: {data}");
    return response.data.data;
  }
  
  // Format 3: {token: '...', user: {...}} ou {token: '...'}
  if (response.data.token) {
    console.log("✅ Format 3 detected: {token}");
    return response.data;
  }
  
  // Format 4: Direct response
  if (typeof response.data === 'object' && !response.data.success && !response.data.data && !response.data.token) {
    console.log("✅ Format 4 detected: direct object");
    return response.data;
  }
  
  console.log("⚠️ Unknown format, returning raw data");
  return response.data;
};

export const login = async (credentials) => {
  console.log("=== AUTH SERVICE LOGIN ===");
  console.log("📧 Email:", credentials.email);
  console.log("⏱️ Timestamp:", new Date().toISOString());
  
  try {
    const response = await api.post("/auth/login", credentials);
    console.log("✅ Login response received:", response.status);
    console.log("Response data:", response.data);
    
    const result = extractData(response);
    console.log("Extracted result:", result);
    
    // Validate response structure
    if (!result.token) {
      throw new Error("❌ No token in login response");
    }
    
    if (!result.user || !result.user.id) {
      throw new Error("❌ No user data in login response");
    }
    
    // Store token and user data in localStorage
    localStorage.setItem("token", result.token);
    console.log("✅ Token stored successfully");
    
    localStorage.setItem("user", JSON.stringify(result.user));
    console.log("✅ User stored successfully");
    
    console.log("=== END AUTH SERVICE LOGIN (SUCCESS) ===");
    return result;
  } catch (err) {
    console.error("❌ Login failed:", err.message);
    console.error("Error response:", err.response?.data);
    console.error("Error status:", err.response?.status);
    console.log("=== END AUTH SERVICE LOGIN (ERROR) ===");
    throw err;
  }
};

export const register = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return extractData(response);
  } catch (err) {
    console.error("❌ Registration failed:", err);
    throw err;
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  console.log("✅ User logged out - local storage cleared");
};

export const getMe = async () => {
  console.log("=== AUTH SERVICE GET ME ===");
  const token = localStorage.getItem('token');
  console.log("🔑 Current token exists:", !!token);
  
  try {
    const response = await api.get("/auth/me");
    console.log("✅ GET /auth/me response received:", response.status);
    console.log("Response data:", response.data);
    
    const result = extractData(response);
    console.log("Extracted /auth/me result:", result);
    console.log("=== END AUTH SERVICE GET ME (SUCCESS) ===");
    
    return result;
  } catch (error) {
    console.error("❌ GET /auth/me failed:", error.message);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.log("=== END AUTH SERVICE GET ME (ERROR) ===");
    throw error;
  }
};

