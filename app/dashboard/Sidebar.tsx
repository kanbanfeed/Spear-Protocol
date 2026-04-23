"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

export default function Sidebar() {
  const { data: session } = useSession()

  const [showPopup, setShowPopup] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const referralLink =
    session?.user
      ? `${process.env.NEXT_PUBLIC_URL}/ref/${encodeURIComponent(
          session.user.username ||
          session.user.referralCode ||
          ""
        )}`
      : ""

  const handleSaveUsername = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/set-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          userId: session?.user?.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data?.error || "Failed to save username")
        return
      }

      alert("Username saved successfully")
      window.location.reload()

    } catch (error) {
      console.error("SAVE USERNAME ERROR:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full py-8 lg:w-80 space-y-8">

      {/* STATS */}
    
      <div className="bg-white border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold">Your Activity</p>

        {!session ? (
          <div className="text-center py-4 space-y-2">
            <p className="text-xs text-gray-500">
              Login to view your session activity
            </p>

            <button
              onClick={() => (window.location.href = "/api/auth/signin")}
              className="text-xs bg-black text-white px-3 py-1 rounded"
            >
              Login
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* REFERRAL */}
      <div className="bg-white border rounded-xl p-4 space-y-3">

        <p className="text-xs text-gray-500">
          Invite & earn 30% recurring
        </p>

        {/* 🔐 NOT LOGGED IN */}
        {!session ? (
          <button
            onClick={() => (window.location.href = "/api/auth/signin")}
            className="w-full bg-green-500 text-white py-3 text-sm rounded-lg animate-pulse"
          >
            Get My Referral Link
          </button>

        ) : !session?.user?.username ? (

          /* 👤 LOGGED IN BUT NO USERNAME */
          <button
            onClick={() => setShowPopup(true)}
            className="w-full bg-green-500 text-white py-3 text-sm rounded-lg animate-pulse"
          >
            Get My Referral Link
          </button>

        ) : (

          /* ✅ SHOW REFERRAL LINK */
          <>
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

            <p className="text-xs text-amber-500">
              Every paid referral also enters both of you into this month’s Dragon’s Den for the $25k cheque.
            </p>
          </>
        )}

      </div>

      {/* USERNAME POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4">

            <p className="text-sm font-medium">
              Create your unique username (this becomes your referral link)
            </p>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="4–20 letters & numbers only"
              className="w-full border p-2 rounded"
            />

            <button
              onClick={handleSaveUsername}
              disabled={loading}
              className="bg-black text-white w-full py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="text-xs text-gray-500 w-full"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  )
}