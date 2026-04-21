"use client"

import { useSession } from "next-auth/react"

export default function Sidebar() {
  const { data: session } = useSession()

  const referralLink =
    session?.user
      ? `${process.env.NEXT_PUBLIC_URL}/ref/${encodeURIComponent(
          session.user.username ||
          session.user.referralCode ||
          ""
        )}`
      : ""

  return (
    <div className="w-full py-8 lg:w-80 space-y-8">

      {/*  STATS */}
      <div className="bg-white border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold">Your Activity</p>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Free</span>
          <span>{session?.user?.freeSessions ?? 0}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Earned</span>
          <span>{session?.user?.sessionsEarned ?? 0}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Used</span>
          <span>{session?.user?.totalSessions ?? 0}</span>
        </div>
      </div>

      {/* 🔗 REFERRAL */}
      <div className="bg-white border rounded-xl p-4 space-y-2">

        <p className="text-xs text-gray-500">
          Invite & earn 30% recurring
        </p>

        <input
          value={referralLink}
          readOnly
          className="w-full border p-2 text-xs rounded"
        />

        <button
          onClick={() => {
            navigator.clipboard.writeText(referralLink)
            alert("Copied")
          }}
          className="w-full bg-black text-white py-2 text-sm rounded"
        >
          Copy Link
        </button>

      </div>

    </div>
  )
}