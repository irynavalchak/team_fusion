import {useSession} from 'next-auth/react';

interface UserWithId {
  id?: string;
}

export const useCurrentUser = () => {
  const {data: session} = useSession();

  const getCurrentUserId = (): number | null => {
    if (!session?.user) {
      return null;
    }

    const userWithId = session.user as typeof session.user & UserWithId;
    if (!userWithId.id) {
      return null;
    }

    const userId = parseInt(userWithId.id, 10);
    return isNaN(userId) ? null : userId;
  };

  const isAuthenticated = (): boolean => {
    return !!session?.user;
  };

  const requireAuth = (): number => {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated or user ID not found');
    }
    return userId;
  };

  return {
    session,
    getCurrentUserId,
    isAuthenticated,
    requireAuth,
    user: session?.user || null
  };
};
