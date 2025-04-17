import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Add cookie functionality to Response interface if it's not present
declare global {
  namespace Express {
    interface Response {
      cookie(name: string, value: string, options?: any): Response;
    }
  }
}

/**
 * Set a cookie on the response if the method doesn't exist
 */
function ensureCookieMethod(res: Response) {
  // Check if cookie method is already defined
  if (typeof res.cookie !== 'function') {
    // Add cookie method to response object
    (res as any).cookie = function(name: string, value: string, options: any = {}) {
      // Build cookie string
      let cookieStr = `${name}=${value}`;
      
      // Add options
      if (options.httpOnly) cookieStr += '; HttpOnly';
      if (options.secure) cookieStr += '; Secure';
      if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;
      if (options.maxAge) cookieStr += `; Max-Age=${Math.floor(options.maxAge / 1000)}`;
      if (options.domain) cookieStr += `; Domain=${options.domain}`;
      if (options.path || options.path === '') cookieStr += `; Path=${options.path || '/'}`;
      
      // Set header
      res.setHeader('Set-Cookie', cookieStr);
      
      return res;
    };
  }
}

/**
 * Custom CSRF protection implementation
 * Provides CSRF token generation and validation without external dependencies
 */

// Store tokens with creation time for expiration management
interface TokenData {
  created: number;
  used: boolean;
}

// In-memory token store - in production, you might want to use Redis or similar
const tokenStore: Map<string, TokenData> = new Map();

// Configuration options
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

/**
 * Generates a cryptographically secure random token
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Cleanup expired tokens periodically
 */
function cleanupTokens() {
  const now = Date.now();
  
  // Manually iterate over map keys to avoid TypeScript iterator issues
  const keys = Array.from(tokenStore.keys());
  keys.forEach(token => {
    const data = tokenStore.get(token);
    if (data && now - data.created > TOKEN_EXPIRY) {
      tokenStore.delete(token);
    }
  });
}

// Start cleanup interval
setInterval(cleanupTokens, CLEANUP_INTERVAL);

/**
 * Middleware to set CSRF token in cookie 
 */
export function csrfProtection(options?: { cookieOptions?: any }) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip for non-mutating methods that don't need CSRF protection
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      next();
      return;
    }
    
    // Check for token in header
    const token = req.headers[CSRF_HEADER_NAME.toLowerCase()] as string;
    
    // If no token found, reject the request
    if (!token) {
      res.status(403).json({ message: 'CSRF token missing' });
      return;
    }
    
    // If token is found but not valid, reject
    const tokenData = tokenStore.get(token);
    if (!tokenData) {
      res.status(403).json({ message: 'Invalid CSRF token' });
      return;
    }
    
    // Check if token has expired
    if (Date.now() - tokenData.created > TOKEN_EXPIRY) {
      tokenStore.delete(token);
      res.status(403).json({ message: 'CSRF token expired' });
      return;
    }
    
    // Mark token as used (one-time use pattern - optional)
    // tokenData.used = true;
    
    // Continue with request
    next();
  };
}

/**
 * Generate a new CSRF token and send it in a cookie
 */
export function generateCsrfToken(req: Request, res: Response) {
  const token = generateToken();
  
  // Store token with creation time
  tokenStore.set(token, {
    created: Date.now(),
    used: false
  });
  
  // Ensure the cookie method is available
  ensureCookieMethod(res);
  
  // Set cookie with token
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Client JavaScript needs to read this
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRY
  });
  
  return token;
}

/**
 * Express route to get a CSRF token
 */
export function csrfTokenRoute(req: Request, res: Response) {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
}