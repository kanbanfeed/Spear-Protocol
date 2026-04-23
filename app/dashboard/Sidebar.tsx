"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

export default function Sidebar() {
  const { data: session } = useSession()

  const [showLink, setShowLink] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [username, setUsername] = useState("")

  const referralLink =
    session?.user?.username
      ? `${process.env.NEXT_PUBLIC_URL}/ref/${session.user.username}`
      : ""

  const handleClick = () => {
    if (!session?.user?.username) {
      setShowPopup(true)
    } else {
      setShowLink(true)
    }
  }

  const saveUsername = async () => {
    if (!username) return

    await fetch("/api/set-username", {
      method: "POST",
      body: JSON.stringify({ username }),
    })

    window.location.reload()
  }

  return (
    <div className="w-full py-8 lg:w-80 space-y-8">

      {/* SESSION COUNTER (KEEP THIS) */}
      <div className="bg-white border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold">Your Activity</p>

        {!session?.user ? (
          <div className="text-center space-y-3 py-4">
            <p className="text-xs text-gray-500">
              Login to view your session usage
            </p>

            <button
              onClick={() => window.location.href = "/api/auth/signin"}
              className="text-sm bg-black text-white px-4 py-2 rounded"
            >
              Login
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Free</span>
              <span>{session.user.freeSessions ?? 0}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Earned</span>
              <span>{session.user.sessionsEarned ?? 0}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Used</span>
              <span>{session.user.totalSessions ?? 0}</span>
            </div>
          </>
        )}
      </div>

      {/*  UPDATED REFERRAL SECTION */}
      <div className="bg-white border rounded-xl p-4 space-y-4">

        {!showLink ? (
          <button
            onClick={handleClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold animate-pulse"
          >
            Get My Referral Link
          </button>
        ) : (
          <>
            <p className="text-sm font-medium">Your referral link:</p>

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

            <p className="text-xs text-gray-500">
              Share this → you get 30% recurring commission forever + your own tier upgraded to free while they stay subscribed.
            </p>

            <p className="text-xs text-gray-500">
              Payouts processed monthly. Minimum $50. Contact support for details.
            </p>

            <p className="text-xs text-gray-500">
              Every paid referral also enters both of you into this month’s Dragon’s Den for the $25k cheque.
            </p>
          </>
        )}
      </div>

      {/* USERNAME POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl space-y-4 w-[300px]">

            <p className="text-sm font-medium">
              Create your unique username
            </p>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter username"
            />

            <button
              onClick={saveUsername}
              className="w-full bg-black text-white py-2 rounded"
            >
              Save
            </button>

          </div>
        </div>
      )}

    </div>
  )
}