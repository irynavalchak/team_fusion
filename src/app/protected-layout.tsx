'use client';

import {useSession} from 'next-auth/react';
import {useRouter, usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function ProtectedLayout({children}: {children: React.ReactNode}) {
  const {data: session, status} = useSession();
  const router = useRouter();
  const pathname = usePathname();
  // Добавляем состояние для отслеживания попыток редиректа
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    // Не выполняем перенаправление, если сессия загружается
    if (status === 'loading') return;

    // Если пользователь не аутентифицирован и страница не относится к авторизации
    if (status === 'unauthenticated' && !pathname.includes('/api/auth')) {
      console.log('Пользователь не авторизован, путь:', pathname);

      // Проверяем, не пытаемся ли мы перенаправить повторно
      if (pathname.includes('/api/auth/error') || redirectAttempted) {
        console.log('Избегаем цикла перенаправлений');
        setRedirectAttempted(true);
        return;
      }

      // Отмечаем, что попытка редиректа была сделана
      setRedirectAttempted(true);

      // Перенаправляем на Discord
      router.push(`/api/auth/signin/discord?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname, redirectAttempted]);

  // Показываем загрузку во время проверки сессии
  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован и мы уже пытались перенаправить
  if (status === 'unauthenticated' && redirectAttempted) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="mb-3">Произошла ошибка при авторизации</div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setRedirectAttempted(false); // Сбрасываем флаг
            router.push(`/api/auth/signin/discord?callbackUrl=${encodeURIComponent('/')}`);
          }}>
          Попробовать войти снова
        </button>
      </div>
    );
  }

  // Если пользователь не авторизован и не на странице авторизации
  if (status === 'unauthenticated' && !pathname.includes('/api/auth')) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div>Перенаправление на страницу авторизации...</div>
      </div>
    );
  }

  // Если пользователь авторизован или на странице авторизации, показываем содержимое
  return <>{children}</>;
}
