'use client';

import {useSession} from 'next-auth/react';
import {useRouter, usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function ProtectedLayout({children}: {children: React.ReactNode}) {
  const {status} = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Всегда вызываем useState перед любыми условиями
  const [isPublicDocument, setIsPublicDocument] = useState<boolean | null>(null);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Всегда вызываем useEffect перед return
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id');
      const contentId = searchParams.get('contentId');
      setIsPublicDocument(pathname === '/documents' && !!id && !!contentId);
    }
  }, [pathname]);

  useEffect(() => {
    if (status === 'loading') return;
    if (isPublicDocument) return;

    if (status === 'unauthenticated' && !pathname.includes('/api/auth')) {
      if (pathname.includes('/api/auth/error') || redirectAttempted) {
        setRedirectAttempted(true);
        return;
      }
      setRedirectAttempted(true);
      router.push(`/api/auth/signin/discord?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname, redirectAttempted, isPublicDocument]);

  // ❗ Вместо раннего return, рендерим заглушку, но useEffect всегда вызывается
  if (isPublicDocument === null) {
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Загрузка...</div>
    );
  }

  // Если это публичная ссылка, рендерим контент
  return isPublicDocument ? (
    <>{children}</>
  ) : status === 'loading' ? (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>
  ) : status === 'unauthenticated' && redirectAttempted ? (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '100vh'}}>
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
  ) : status === 'unauthenticated' && !pathname.includes('/api/auth') ? (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <div>Перенаправление на страницу авторизации...</div>
    </div>
  ) : (
    <>{children}</>
  );
}
