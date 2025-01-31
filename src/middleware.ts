import {NextRequest, NextResponse} from 'next/server';
import {withAuth} from 'next-auth/middleware';

const API_BASE_URL = process.env.API_BASE_URL || '';

const allowedOrigins = [API_BASE_URL];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Create the CORS middleware
function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflight requests
  const isPreflight = request.method === 'OPTIONS';
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && {'Access-Control-Allow-Origin': origin}),
      ...corsOptions
    };
    return NextResponse.json({}, {headers: preflightHeaders});
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Export the main middleware function enhanced with auth
export default withAuth(
  // Function that is called by the middleware
  function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Handle API routes with CORS
    if (pathname.startsWith('/api/')) {
      return corsMiddleware(request);
    }

    // For protected routes, withAuth will handle the authentication
    // For all other routes, continue without modification
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({token}) => !!token
    }
  }
);

// Configure protected routes and API routes
export const config = {
  matcher: ['/finance/:path*', '/api/:path*']
};
