import {NextRequest, NextResponse} from 'next/server';
import {withAuth} from 'next-auth/middleware';
import {NextRequestWithAuth} from 'next-auth/middleware';
import {NextFetchEvent} from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || '';

const allowedOrigins = [API_BASE_URL];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const publicPaths = [
  '/api/auth', // API authentication
  '/api/auth/callback', // Add this line
  '/api/auth/callback/discord', // And this line
  '/_next', // Next.js static resources
  '/favicon.ico' // Favicon
];

// Функция для CORS
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

// Проверка, является ли путь публичным
function isPublicPath(path: string) {
  return publicPaths.some(publicPath => path.startsWith(publicPath));
}

// Основная функция middleware
export default async function middleware(request: NextRequestWithAuth, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  // Разрешаем доступ к публичным путям без проверки авторизации
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Более простой подход: для API-путей используем единую обработку
  if (pathname.startsWith('/api/')) {
    // Создаем middleware для авторизации с CORS
    return withAuth(
      function onSuccess(req) {
        return corsMiddleware(req);
      },
      {
        callbacks: {
          authorized: ({token}) => !!token
        }
      }
    )(request, event);
  }

  // Для всех остальных путей используем стандартную проверку авторизации
  return withAuth(
    function onSuccess(req) {
      return NextResponse.next();
    },
    {
      pages: {
        signIn: '/api/auth/signin'
      },
      callbacks: {
        authorized: ({token}) => !!token
      }
    }
  )(request, event);
}

// Matcher для всех путей, кроме системных Next.js
export const config = {
  matcher: [
    // Исключаем системные пути Next.js
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
