// src/lib/apiService.ts
import type { User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

interface ApiErrorData {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(message: string, status: number, data: ApiErrorData) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("accessToken");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && options.body) { // Don't set Content-Type for FormData
    headers.append("Content-Type", "application/json");
  }


  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorData: ApiErrorData = { message: response.statusText };
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore if response is not JSON
      }
      
      console.error("API Error:", response.status, errorData);
      // Handle 401 specifically: redirect to login or refresh token
      if (response.status === 401 && typeof window !== 'undefined') {
         localStorage.removeItem("accessToken");
         localStorage.removeItem("originalUser");
         window.location.href = "/login"; // Or use Next.js router if appropriate context
      }
      throw new ApiError(
        Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message || response.statusText, 
        response.status, 
        errorData
      );
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") { // Handle No Content
        return undefined as T;
    }
    
    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Network or other error:", error);
    throw new ApiError( (error as Error).message || "An unexpected error occurred", 0, {message: (error as Error).message});
  }
}

export const apiService = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T, U>(endpoint: string, body: U, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T, U>(endpoint: string, body: U, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: <T, U>(endpoint: string, body: U, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

// Auth specific services
export const authService = {
  login: async (credentials: { email: string, password: string }): Promise<{ accessToken: string }> => {
    return apiService.post<{ accessToken: string }, typeof credentials>("/auth/login", credentials);
  },
  getProfile: async (): Promise<User> => {
    return apiService.get<User>("/auth/profile");
  },
};
