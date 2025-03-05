'use client';

import {useSession} from 'next-auth/react';

export default function HomePage() {
  const {data: session, status} = useSession();

  // Показываем загрузку при проверке сессии
  if (status === 'loading') {
    return (
      <div className="container d-flex justify-content-center">
        <div className="spinner-border mt-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-20">
      <h1>
        Добро пожаловать, <b>{session?.user?.name || 'Пользователь'}</b>!
      </h1>
      <p>Вы успешно авторизованы через Discord.</p>
    </div>
  );
}
