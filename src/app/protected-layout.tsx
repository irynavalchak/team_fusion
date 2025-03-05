'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isPublicDocument, setIsPublicDocument] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id');
      const contentId = searchParams.get('contentId');

      // Если это публичная ссылка, сохраняем флаг
      if (pathname === '/documents' && id && contentId) {
        setIsPublicDocument(true);
      } else {
        setIsPublicDocument(false);
      }
    }
  }, [pathname]);

  // Показываем заглушку, пока идет проверка (чтобы избежать разницы в SSR и CSR)
  if (isPublicDocument === null) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>;
  }

  // Если это публичная ссылка, рендерим контент без авторизации
  if (isPublicDocument) {
    return <>{children}</>;
  }

  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' && !pathname.includes('/api/auth')) {
      console.log('Пользователь не авторизован, путь:', pathname);

      if (pathname.includes('/api/auth/error') || redirectAttempted) {
        setRedirectAttempted(true);
        return;
      }

      setRedirectAttempted(true);
      router.push(`/api/auth/signin/discord?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname, redirectAttempted]);

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' && redirectAttempted) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="mb-3">Произошла ошибка при авторизации</div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setRedirectAttempted(false);
            router.push(`/api/auth/signin/discord?callbackUrl=${encodeURIComponent('/')}`);
          }}>
          Попробовать войти снова
        </button>
      </div>
    );
  }

  if (status === 'unauthenticated' && !pathname.includes('/api/auth')) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div>Перенаправление на страницу авторизации...</div>
      </div>
    );
  }

  return <>{children}</>;
}
