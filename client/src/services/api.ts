import { supabase } from "../lib/supabaseClient";

/**
 * Base URL for the Express backend.
 * In a real app, this should come from process.env.NEXT_PUBLIC_API_URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

/**
 * A wrapper around native fetch that:
 * 1. Automatically attaches the Supabase JWT Bearer token if available.
 * 2. Parses JSON responses automatically.
 * 3. Throws structured ApiErrors for non-2xx responses.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = new Headers(options.headers || {});
  
  // Set default JSON Content-Type if not providing FormData (e.g. file uploads)
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach auth token
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle empty responses (like 204 No Content)
  if (response.status === 204 || response.headers.get("Content-Length") === "0") {
    if (!response.ok) {
        throw new ApiError(response.status, "Request failed");
    }
    return {} as T;
  }

  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = typeof data === 'object' && data.error 
      ? (typeof data.error === 'string' ? data.error : JSON.stringify(data.error)) 
      : response.statusText;
    
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

// Pre-configured HTTP methods for cleaner syntax
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  
  post: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    apiFetch<T>(endpoint, { 
      ...options, 
      method: "POST", 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  put: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    apiFetch<T>(endpoint, { 
      ...options, 
      method: "PUT", 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    apiFetch<T>(endpoint, { 
      ...options, 
      method: "PATCH", 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) => 
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
