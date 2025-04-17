// Custom type declarations to handle missing or problematic types

// Express rate limit replacement types
declare module 'express-rate-limit' {
  import { RequestHandler } from 'express';
  
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

  function rateLimit(options?: Options): RequestHandler;
  
  export = rateLimit;
}

// Helmet replacement types
declare module 'helmet' {
  import { RequestHandler } from 'express';
  
  interface HelmetOptions {
    contentSecurityPolicy?: boolean | object;
    crossOriginEmbedderPolicy?: boolean | object;
    crossOriginOpenerPolicy?: boolean | object;
    crossOriginResourcePolicy?: boolean | object;
    dnsPrefetchControl?: boolean | object;
    expectCt?: boolean | object;
    frameguard?: boolean | object;
    hidePoweredBy?: boolean | object;
    hsts?: boolean | object;
    ieNoOpen?: boolean | object;
    noSniff?: boolean | object;
    originAgentCluster?: boolean | object;
    permittedCrossDomainPolicies?: boolean | object;
    referrerPolicy?: boolean | object;
    xssFilter?: boolean | object;
  }
  
  function helmet(options?: HelmetOptions): RequestHandler;
  
  namespace helmet {
    function contentSecurityPolicy(options?: object): RequestHandler;
    function crossOriginEmbedderPolicy(options?: object): RequestHandler;
    function crossOriginOpenerPolicy(options?: object): RequestHandler;
    function crossOriginResourcePolicy(options?: object): RequestHandler;
    function dnsPrefetchControl(options?: object): RequestHandler;
    function expectCt(options?: object): RequestHandler;
    function frameguard(options?: object): RequestHandler;
    function hidePoweredBy(options?: object): RequestHandler;
    function hsts(options?: object): RequestHandler;
    function ieNoOpen(): RequestHandler;
    function noSniff(): RequestHandler;
    function originAgentCluster(): RequestHandler;
    function permittedCrossDomainPolicies(options?: object): RequestHandler;
    function referrerPolicy(options?: object): RequestHandler;
    function xssFilter(options?: object): RequestHandler;
  }
  
  export = helmet;
}

// Cookie-parser replacement types
declare module 'cookie-parser' {
  import { RequestHandler } from 'express';
  
  function cookieParser(secret?: string | string[], options?: object): RequestHandler;
  
  namespace cookieParser {
    function JSONCookie(str: string): object | undefined;
    function JSONCookies(cookies: object): object;
    function signedCookie(str: string, secret: string | string[]): string | false;
    function signedCookies(cookies: object, secret: string | string[]): object;
  }
  
  export = cookieParser;
}

// CSRF replacement types
declare module 'csurf' {
  import { RequestHandler } from 'express';
  
  interface CsurfOptions {
    cookie?: boolean | object;
    ignoreMethods?: string[];
    sessionKey?: string;
    value?: (req: any) => string;
  }
  
  function csrf(options?: CsurfOptions): RequestHandler;
  
  export = csrf;
}