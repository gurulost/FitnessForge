/**
 * Client-side CSRF protection utilities
 */

import { apiRequest } from './queryClient';

const CSRF_HEADER = 'X-XSRF-TOKEN';
const CSRF_COOKIE = 'XSRF-TOKEN';

/**
 * Get a CSRF token from the cookie or fetch a new one if none exists
 */
export async function getCsrfToken(): Promise<string> {
  // First try to get the token from the cookie
  const token = getCsrfTokenFromCookie();
  if (token) {
    return token;
  }
  
  // If no token in cookie, request a new one from the server
  try {
    const response = await fetch('/api/csrf-token');
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw new Error('Failed to fetch CSRF token');
  }
}

/**
 * Get CSRF token from cookie
 */
function getCsrfTokenFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE) {
      return value;
    }
  }
  return null;
}

/**
 * Add CSRF token to request headers
 */
export function addCsrfHeader(headers: HeadersInit = {}): Promise<HeadersInit> {
  return getCsrfToken().then(token => {
    const newHeaders = new Headers(headers);
    newHeaders.append(CSRF_HEADER, token);
    return newHeaders;
  });
}

/**
 * Enhanced apiRequest with CSRF protection
 */
export async function apiRequestWithCsrf(
  method: string,
  endpoint: string,
  body?: object,
  customHeaders?: HeadersInit
): Promise<Response> {
  const headers = await addCsrfHeader(customHeaders);
  return apiRequest(method, endpoint, body, headers);
}