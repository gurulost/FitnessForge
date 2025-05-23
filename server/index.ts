import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";
import { csrfProtection, csrfTokenRoute } from "./csrf";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security headers implemented manually - helmet replacement
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://api.anthropic.com;");
  next();
});

// Custom cookie parser middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies && req.headers.cookie) {
    req.cookies = {};
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.match(/(.*?)=(.*)$/);
      if (parts) {
        req.cookies[parts[1].trim()] = (parts[2] || '').trim();
      }
    });
  }
  next();
});

// CSRF protection routes
app.get('/api/csrf-token', csrfTokenRoute);

// Apply CSRF protection to all mutating API routes
// Skip auth-related endpoints to prevent lockout
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF check for auth endpoints and non-mutating methods
  if (
    req.path === '/auth/login' || 
    req.path === '/auth/register' || 
    req.path === '/auth/google' || 
    req.path === '/auth/google/callback' ||
    ['GET', 'HEAD', 'OPTIONS'].includes(req.method)
  ) {
    return next();
  }
  
  // Apply CSRF protection to all other API endpoints
  return csrfProtection()(req, res, next);
});

// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      return next();
    }
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
}

// Simple in-memory rate limiter implementation
const requestCounts: Record<string, { count: number, resetTime: number }> = {};

// API rate limiter middleware (100 requests per 15 minutes)
const apiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  // Initialize or reset if window expired
  if (!requestCounts[ip] || now > requestCounts[ip].resetTime) {
    requestCounts[ip] = { count: 1, resetTime: now + windowMs };
    return next();
  }

  // Increment count and check limit
  requestCounts[ip].count++;
  if (requestCounts[ip].count <= maxRequests) {
    return next();
  }

  // Rate limit exceeded
  return res.status(429).json({
    message: 'Too many requests, please try again later.',
    retryAfter: Math.ceil((requestCounts[ip].resetTime - now) / 1000)
  });
};

// Auth rate limiter middleware (5 requests per 15 minutes)
const authRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const authKey = `auth_${ip}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  // Initialize or reset if window expired
  if (!requestCounts[authKey] || now > requestCounts[authKey].resetTime) {
    requestCounts[authKey] = { count: 1, resetTime: now + windowMs };
    return next();
  }

  // Increment count and check limit
  requestCounts[authKey].count++;
  if (requestCounts[authKey].count <= maxRequests) {
    return next();
  }

  // Rate limit exceeded
  return res.status(429).json({
    message: 'Too many login attempts, please try again later.',
    retryAfter: Math.ceil((requestCounts[authKey].resetTime - now) / 1000)
  });
};

// Apply rate limiters to routes
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/register', authRateLimiter);
app.use('/api', apiRateLimiter); // Apply to all API routes

// Setup authentication
setupAuth(app);

// Request logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Start the server
(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite in development or serve static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start the server on port 5000
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();