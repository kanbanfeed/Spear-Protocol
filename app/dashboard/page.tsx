import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import Console from "./Console"
import ReferralCard from "./ReferralCard"
import DashboardLayout from "./DashboardLayout"

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>
}) {
  // Unwrap searchParams properly
  const params = await searchParams
  const viewingSession = params?.session

  // Read cookie
  const cookieStore = await cookies()
  const email = cookieStore.get("user_email")?.value

  if (!email) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-12 w-full max-w-md text-center space-y-8 shadow-sm">

          <div className="space-y-4">
            <p className="text-xs tracking-[0.4em] text-gray-400">
              ACCESS SPEAR PROTOCOL
            </p>

            <h1 className="text-2xl font-serif text-gray-900">
              Verify Your Access
            </h1>

            <p className="text-sm text-gray-500">
              Enter the email used during initiation.
            </p>
          </div>

          <form action="/api/auth/verify" method="POST" className="space-y-6">

            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />

            <button
              type="submit"
              className="w-full py-3 text-xs tracking-[0.3em] uppercase bg-gray-900 text-white rounded-xl hover:opacity-90 transition"
            >
              Verify Access
            </button>

          </form>

        </div>
      </div>
    )
  }

  // Fetch user + sessions
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      sessions: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-gray-500">User not found.</p>
      </div>
    )
  }

  return (
    <DashboardLayout
      sidebar={
        <aside className="md:w-80 w-full md:fixed md:inset-y-0 md:left-0 border-r border-gray-200 bg-white px-8 py-10 overflow-y-auto flex flex-col">

          <div className="flex-1 space-y-14">

            <div>
              <p className="text-xs tracking-[0.45em] text-gray-400">
                SPEAR PROTOCOL
              </p>
              <div className="w-12 h-[2px] bg-gray-900 mt-4" />
            </div>

            {viewingSession && (
              <a
                href="/dashboard"
                className="block w-full text-center py-3 text-xs tracking-[0.35em] uppercase rounded-xl bg-gray-900 text-white hover:opacity-90 transition"
              >
                New Session
              </a>
            )}

            <div>
              <h2 className="text-xs tracking-[0.35em] text-gray-500 mb-6">
                PAST SESSIONS
              </h2>

              <ul className="space-y-4 text-sm text-gray-800">
                {user.sessions.length === 0 && (
                  <li className="text-gray-400 text-xs">
                    No sessions yet
                  </li>
                )}

                {user.sessions.map((session) => {
                  const isActive = viewingSession === session.id

                  return (
                    <li key={session.id}>
                      <a
                        href={`?session=${session.id}`}
                        className={`block px-3 py-2 rounded-lg transition ${
                          isActive
                            ? "bg-gray-100 text-black"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-gray-300">→</span>
                        </div>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div>
              <h2 className="text-xs tracking-[0.35em] text-gray-500 mb-6">
                REFERRAL
              </h2>

              <ReferralCard
                code={user.referralCode}
                credit={user.referralCredit}
              />
            </div>

          </div>

          <div className="pt-10 border-t border-gray-200 mt-10">
            <h2 className="text-xs tracking-[0.35em] text-gray-500 mb-2">
              FOUR SPOTS
            </h2>
            <p className="text-xs text-gray-400 tracking-wide">
              COMING SOON
            </p>
          </div>

        </aside>
      }
    >
      <main className="px-6 md:px-20 py-12 overflow-y-auto">

        <div className="max-w-5xl mx-auto">

          <div className="mb-16">
            <p className="text-xs tracking-[0.45em] text-gray-400 mb-3">
              SESSION CONSOLE
            </p>

            <h1 className="text-4xl font-serif text-gray-900">
              {viewingSession
                ? "Session Archive"
                : "Initiate Daily Ritual"}
            </h1>

            <div className="w-16 h-[2px] bg-gray-900 mt-6" />
          </div>

          {/* ✅ ONLY CHANGE: passing userId */}
          <Console
            email={email}
            sessions={user.sessions}
            userId={user.id}
          />

        </div>

      </main>
    </DashboardLayout>
  )
}