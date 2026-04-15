"use client"

import { useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import {
  FaLinkedin,
  FaGoogle,
  FaGithub,
  FaDiscord,
  FaReddit,
  FaFacebook,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export default function HeaderAuth() {
  const { data: session } = useSession()

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const providers = [
    { name: "LinkedIn", icon: <FaLinkedin />, id: "linkedin" },
    { name: "Google", icon: <FaGoogle />, id: "google" },
    { name: "X (Twitter)", icon: <FaXTwitter />, id: "twitter" },
    { name: "GitHub", icon: <FaGithub />, id: "github" },
    { name: "Discord", icon: <FaDiscord />, id: "discord" },
    { name: "Reddit", icon: <FaReddit />, id: "reddit" },
    { name: "Facebook", icon: <FaFacebook />, id: "facebook" },
  ]

  //  Close modal on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLoginModal(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  //  Email validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleEmailSend = async () => {
    setError("")

    if (!emailInput) {
      setError("Please enter your email")
      return
    }

    if (!isValidEmail(emailInput)) {
      setError("Enter a valid email address")
      return
    }

    const output = (window as any).latestOutput

    if (!output) {
      setError("No report available to send")
      return
    }

    try {
      setSending(true)

      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "email",
          email: emailInput,
          output,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to send email")
      }

      setShowLoginModal(false)
      setEmailInput("")
      alert("Your report has been sent to your email")
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* RIGHT SIDE */}
      {session?.user ? (
  <div className="flex items-center gap-3">
    <img
      src={session.user.image || ""}
      alt="Profile"
      className="w-10 h-10 rounded-full border shadow-sm"
    />

    <div className="text-right hidden sm:block">
      <p className="text-sm font-medium">{session.user.name}</p>
      <p className="text-xs text-gray-500">
        {session.user.email}
      </p>
    </div>

    {/* 🔥 LOGOUT BUTTON */}
    <button
      onClick={() => signOut()}
      className="px-3 py-1 text-xs border rounded-md hover:bg-black hover:text-white transition"
    >
      Logout
    </button>
  </div>
) : (
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-4 py-2 text-sm border rounded-md hover:bg-black hover:text-white transition font-medium"
        >
          Login
        </button>
      )}

      {/* MODAL */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TITLE */}
            <h2 className="text-lg font-semibold text-center mb-1">
              Continue with
            </h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Unlock full decision matrix instantly
            </p>

            {/* SOCIAL LOGIN */}
            <div className="grid gap-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() =>
                    signIn(provider.id, { callbackUrl: "/dashboard" })
                  }
                  className="flex items-center justify-center gap-3 border p-3 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  <span className="text-lg">{provider.icon}</span>
                  {provider.name}
                </button>
              ))}
            </div>

            {/* DIVIDER */}
            <div className="my-5 flex items-center">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* EMAIL LOGIN */}
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full border p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />

              {error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}

              <button
                onClick={handleEmailSend}
                disabled={sending}
                className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {sending ? "Sending..." : "Continue with Email"}
              </button>
            </div>

            {/* CANCEL */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 w-full text-sm text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}