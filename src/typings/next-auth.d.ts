declare module 'next-auth' {
  interface User {
    id?: string;
    discord_id?: string;
    roles?: string[];
    username?: string;
  }

  interface Session {
    user: User & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
