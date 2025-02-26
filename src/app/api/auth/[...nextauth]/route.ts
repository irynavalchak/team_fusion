import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import axios from 'axios';

import ROLE from 'constants/role';

const API_BASE_URL = process.env.API_BASE_URL || '';

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string
    })
  ],

  // Настройки страниц
  pages: {
    error: '/api/auth/error'
  },

  // Включаем режим отладки в разработке
  debug: process.env.NODE_ENV === 'development',

  // Настройки сессии - используем JWT для сохранения между запросами
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 дней
  },

  callbacks: {
    async signIn({user, account}) {
      try {
        console.log('SignIn callback начал работу');
        console.log('User:', user);
        console.log('Account:', account);

        if (!account?.providerAccountId) {
          console.error('No provider account ID');
          throw new Error('No provider account ID');
        }

        // Проверяем существование пользователя
        console.log(`Проверяем пользователя с Discord ID: ${account.providerAccountId}`);
        const checkUserResponse = await axios.post(
          `${API_BASE_URL}/api/rest/get_user_by_discord_id`,
          {
            discord_id: account.providerAccountId
          },
          {
            headers: {
              'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Ответ API о пользователе:', checkUserResponse.data);

        // Если пользователь не найден, создаем нового
        if (!checkUserResponse.data.users.length) {
          console.log(`Создаем нового пользователя для Discord ID: ${account.providerAccountId}`);
          // 1. Создаём пользователя
          const createUserResponse = await axios.post(
            `${API_BASE_URL}/api/rest/user`,
            {
              discord_id: account.providerAccountId,
              email: user.email,
              username: user.name,
              avatar_url: user.image
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
              }
            }
          );

          const newUserId = createUserResponse?.data?.insert_users_one?.id;
          console.log('Создан новый пользователь с ID:', newUserId);

          // 2. Добавляем роль пользователю
          await axios.post(
            `${API_BASE_URL}/api/rest/user_role`,
            {
              user_id: newUserId,
              role_id: 1 // ID роли "Гость"
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
              }
            }
          );
          console.log('Роль успешно добавлена пользователю.');
        }

        console.log('SignIn callback успешно завершен');
        return true;
      } catch (error) {
        console.error('Ошибка в signIn callback:', error);
        return false;
      }
    },

    async session({session, token}) {
      try {
        console.log('Session callback начал работу');
        console.log('Token:', token);

        const response = await axios.post(
          `${API_BASE_URL}/api/rest/get_user_by_discord_id`,
          {
            discord_id: token.sub
          },
          {
            headers: {
              'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
              'Content-Type': 'application/json'
            }
          }
        );

        const userData = response.data.users[0];
        console.log('Данные пользователя из БД:', userData);

        if (userData) {
          const enhancedSession = {
            ...session,
            user: {
              ...session.user,
              id: userData.id,
              discord_id: userData.discord_id,
              roles: userData.user_roles_new?.map((item: any) => item?.role?.role_name) || [ROLE.GUEST],
              username: userData.username
            }
          };

          console.log('Обновленная сессия:', enhancedSession);
          return enhancedSession;
        }

        console.log('Пользователь не найден в БД, возвращаем гостевую роль');
        return {
          ...session,
          user: {
            ...session.user,
            roles: ['guest']
          }
        };
      } catch (error) {
        console.error('Ошибка в session callback:', error);
        return session;
      }
    },

    async jwt({token, account}) {
      console.log('JWT callback вызван');
      if (account) {
        console.log('Добавляем discord_id в токен:', account.providerAccountId);
        token.discord_id = account.providerAccountId;
      }
      return token;
    },

    // Автоматическое перенаправление после входа
    async redirect({url, baseUrl}) {
      console.log('Redirect callback вызван');
      console.log('URL:', url);
      console.log('Base URL:', baseUrl);

      // Пытаемся использовать предоставленный URL, если он безопасен
      if (url.startsWith(baseUrl)) {
        console.log(`Перенаправляем на: ${url}`);
        return url;
      }
      // Иначе перенаправляем на главную
      console.log(`Перенаправляем на базовый URL: ${baseUrl}`);
      return baseUrl;
    }
  }
});

export {handler as GET, handler as POST};
