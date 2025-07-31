import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import axios from 'axios';

import ROLE from 'constants/role';

// Интерфейсы для callback'ов
interface CallbackUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

interface CallbackAccount {
  providerAccountId: string;
  provider: string;
  type: string;
}

interface CallbackSession {
  user: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    roles?: string[];
    username?: string;
    discord_id?: string;
  };
  expires: string;
}

interface CallbackJWT {
  sub?: string;
  discord_id?: string;
  [key: string]: any;
}

interface UserRole {
  role: {
    role_name: string;
  };
}

const API_BASE_URL = process.env.API_BASE_URL || '';

const nextAuthOptions = {
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
    async signIn({user, account}: {user: CallbackUser; account: CallbackAccount | null}) {
      try {
        if (!account?.providerAccountId) {
          console.error('No provider account ID');
          throw new Error('No provider account ID');
        }

        // Проверяем существование пользователя
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

        // Если пользователь не найден, создаем нового
        if (!checkUserResponse.data.users.length) {
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
        }

        return true;
      } catch (error) {
        console.error('Ошибка в signIn callback:', error);
        return false;
      }
    },

    async session({session, token}: {session: CallbackSession; token: CallbackJWT}) {
      try {
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

        if (userData) {
          const enhancedSession = {
            ...session,
            user: {
              ...session.user,
              id: userData.id,
              discord_id: userData.discord_id,
              roles: userData.user_roles_new?.map((item: UserRole) => item?.role?.role_name) || [ROLE.GUEST],
              username: userData.username
            }
          };

          return enhancedSession;
        }

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

    async jwt({token, account}: {token: CallbackJWT; account: CallbackAccount | null}) {
      if (account) {
        token.discord_id = account.providerAccountId;
      }
      return token;
    },

    // Автоматическое перенаправление после входа
    async redirect({url, baseUrl}: {url: string; baseUrl: string}) {
      // Пытаемся использовать предоставленный URL, если он безопасен
      if (url.startsWith(baseUrl)) return url;

      // Иначе перенаправляем на главную
      return baseUrl;
    }
  }
};

const handler = (NextAuth as any)(nextAuthOptions);

export {handler as GET, handler as POST};
