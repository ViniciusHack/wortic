import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import prisma from "../../../services/prisma";

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
        if(!user.email || !user.name) {
          throw new Error("Email is required.")
        }
        const userFound = await prisma.player.findUnique({
          where: {
            email: user.email
          }
        })

        if(!userFound) {
          await prisma.player.create({
            data: {
              email: user.email,
              external_id: user.id,
              name: user.name,
              image: user.image
            }
          })
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }
})