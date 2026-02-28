"use client"

import { useState } from "react"

export default function ReferralCard({
  code,
  credit,
}: {
  code: string
  credit: number
}) {
  const [copied, setCopied] = useState(false)
  const [inputCode, setInputCode] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleApply() {
    if (!inputCode.trim()) return

    setLoading(true)
    setMessage("")

    const res = await fetch("/api/referral/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralCode: inputCode }),
    })

    const data = await res.json()

    if (data.success) {
      setMessage("Referral applied successfully.")
      setInputCode("")
    } else {
      setMessage(data.error || "Invalid referral code.")
    }

    setLoading(false)
  }

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 space-y-6">

      {/* Your Code */}
      <div className="space-y-4">
        <p className="text-xs tracking-[0.35em] text-gray-500">
          YOUR CODE
        </p>

        <div className="flex items-center justify-between">
          <p className="text-sm tracking-[0.25em] text-gray-900 font-medium">
            {code}
          </p>

          <button
            onClick={handleCopy}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Credit Balance
          </p>
          <p className="text-lg font-medium text-gray-900 mt-1">
            ${credit}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-4">

        <p className="text-xs tracking-[0.35em] text-gray-500">
          APPLY REFERRAL
        </p>

        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          placeholder="ENTER CODE"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm tracking-widest focus:outline-none focus:ring-1 focus:ring-gray-900"
        />

        <button
          onClick={handleApply}
          disabled={loading}
          className={`w-full py-3 text-xs tracking-[0.3em] uppercase rounded-xl transition-all
            ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gray-900 text-white hover:opacity-90"
            }`}
        >
          {loading ? "Applying..." : "Apply Code"}
        </button>

        {message && (
          <p className="text-xs text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}