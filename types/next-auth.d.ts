import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      referralCode?: string
      referralCredit?: number
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string | null
      freeSessions?: number
      totalSessions?: number
      sessionsEarned?: number
    }
  }

  interface User {
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string
  }
}