'use client';

import {useSearchParams} from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">Ошибка авторизации</h4>
            </div>
            <div className="card-body">
              <p>
                При авторизации произошла ошибка: <strong>{error}</strong>
              </p>

              {error === 'AccessDenied' && (
                <div className="alert alert-warning">
                  <p>Возможные причины:</p>
                  <ul>
                    <li>Вы отказались дать разрешения приложению в Discord</li>
                    <li>Возникла проблема с настройками OAuth в Discord</li>
                    <li>Проблема с серверной обработкой вашей авторизации</li>
                  </ul>
                </div>
              )}

              <div className="d-grid gap-2 mt-4">
                <Link href="/api/auth/signin/discord" className="btn btn-primary">
                  Попробовать еще раз
                </Link>
                <Link href="/" className="btn btn-outline-secondary">
                  Вернуться на главную
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
