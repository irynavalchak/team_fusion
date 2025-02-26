import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    roles?: string[];
  }

  interface Session {
    user: User;
  }
}
