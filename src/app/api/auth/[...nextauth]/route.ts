import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string
    })
  ],
  // Add more specific configuration for different environments
  callbacks: {
    async session({session, token, user}) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        }
      };
    },
    async redirect({url, baseUrl}) {
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    }
  }
});

export {handler as GET, handler as POST};
