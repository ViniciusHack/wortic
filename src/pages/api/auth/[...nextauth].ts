import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!
    })
  ],

  callbacks: {
    async signIn({ user }){
      try {
        console.log(user);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }
})