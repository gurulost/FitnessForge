import { Request as ExpressRequest, RequestHandler } from 'express';

declare global {
  namespace Express {
    interface Request {
      // Add missing csrfToken method from csurf
      csrfToken(): string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    // Add additional session properties as needed
    passport?: any;
  }
}

// Express Rate Limit options
declare namespace ExpressRateLimit {
  interface Options {
    windowMs?: number;
    max?: number;
    message?: string | object;
    statusCode?: number;
    headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    requestPropertyName?: string;
    skip?: (req: any, res: any) => boolean;
    keyGenerator?: (req: any, res: any) => string;
    handler?: (req: any, res: any, next: any) => void;
    onLimitReached?: (req: any, res: any, options: Options) => void;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    store?: any;
  }
}

declare module 'express-rate-limit' {
  function rateLimit(options?: ExpressRateLimit.Options): RequestHandler;
  export = rateLimit;
}