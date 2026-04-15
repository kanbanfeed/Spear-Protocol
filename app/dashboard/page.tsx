export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import HeaderAuth from "./HeaderAuth"
import Console from "./Console"
import Image from "next/image"
import Link from "next/link"


export default async function Dashboard() {
  
  // Get logged-in user session
  const session = await getServerSession(authOptions)

  //  Fetch user sessions from DB
  let userSessions: any[] = []

  if (session?.user?.id) {
    userSessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-20 h-20">
              <Image
                src="/logo-desktop.jpeg"
                alt="SPEAR Protocol Logo"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold text-black">
                SPEAR
              </span>
              <span className="text-xs text-amber-500">
                PROTOCOL
              </span>
            </div>
          </Link>

          {/* RIGHT SIDE */}
          <HeaderAuth />
        </div>

        {/*  PASS REAL USER DATA */}
        <Console
          email={session?.user?.email || ""}
          sessions={userSessions}
          userId={session?.user?.id || "guest"}
        />

      </div>
    </div>
  )
}