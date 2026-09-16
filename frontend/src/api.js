// Centralized API configuration
const rawUrl = import.meta.env.VITE_API_URL;

export const API_URL = (
  rawUrl && rawUrl !== "undefined" && rawUrl.trim() !== ""
    ? rawUrl.trim()
    : "http://localhost:5001"
).replace(/\/$/, "");

// Get Auth Token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("token") || "";
};

// Get default headers with Authorization token if available
export const getAuthHeaders = (additionalHeaders = {}) => {
  const token = getAuthToken();
  const headers = { ...additionalHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Helper function to make fetch calls safely with authentication
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers = getAuthHeaders(options.headers || {});
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}: ${text.slice(0, 100)}`);
    }
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
