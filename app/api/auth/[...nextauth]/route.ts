import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"
import DiscordProvider from "next-auth/providers/discord"
import RedditProvider from "next-auth/providers/reddit"
import LinkedInProvider from "next-auth/providers/linkedin"
import TwitterProvider from "next-auth/providers/twitter"
import AppleProvider from "next-auth/providers/apple"
import NextAuth, { type AuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"

//  EXPORT THIS
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
    RedditProvider({
      clientId: process.env.REDDIT_ID!,
      clientSecret: process.env.REDDIT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID!,
      clientSecret: process.env.LINKEDIN_SECRET!,
      authorization: {
        params: {
          scope: "r_liteprofile r_emailaddress",
        },
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      version: "2.0",
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        const provider = account?.provider

        let username = null
        let jobTitle = null
        let company = null

        if (provider === "github") {
          username = profile?.login
        }

        if (provider === "twitter") {
          username = profile?.username
        }

        if (provider === "linkedin") {
          jobTitle = profile?.headline
          company = profile?.organization
        }

        const dbUser = await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            platform: provider,
            name: user.name,
            profileImage: user.image,
            username,
            jobTitle,
            company,
          },
          create: {
            email: user.email!,
            referralCode: Math.random().toString(36).substring(2, 8),
            platform: provider,
            name: user.name,
            profileImage: user.image,
            username,
            jobTitle,
            company,
          },
        })

        user.id = dbUser.id

        return true
      } catch (err) {
        console.error("SIGNIN ERROR:", err)
        return false
      }
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id // ✅ store DB id in token
      }
      return token
    },
    async session({ session, token }: any) {
  if (session.user && token.id) {
  const user = await prisma.user.findUnique({
    where: { id: token.id as string },
  })
   

    if (user) {
      session.user.id = user.id
      session.user.referralCode = user.referralCode || "" // ✅ FIX
      session.user.referralCredit = user.referralCredit || 0
      session.user.username = user.username || null
    }
  }

  return session
}
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

//  USE IT HERE
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }