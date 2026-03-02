"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function Console({
  email,
  sessions,
  userId,
}: {
  email: string
  sessions: any[]
  userId: string
}) {
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("session")

  const selectedSession = sessions.find(
    (s) => s.id === selectedId
  )

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [stage, setStage] = useState<
    "idle" | "analyzing" | "rearchitecting" | "done"
  >("idle")

  const isProcessing =
    stage === "analyzing" || stage === "rearchitecting"

  async function handleSubmit() {
    if (!input.trim() || isProcessing) return

    setStage("analyzing")

    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, email }),
    })

    const data = await res.json()
    setOutput(data.output)

    setTimeout(() => {
      setStage("rearchitecting")
    }, 3000)

    setTimeout(() => {
      setStage("done")
    }, 7000)
  }

  /* ========================= */
  /* PAST SESSION VIEW */
  /* ========================= */
  if (selectedSession) {
    return (
      <div className="space-y-10">

        <div>
          <p className="text-xs tracking-[0.4em] text-gray-400 mb-3">
            PAST SESSION
          </p>
          <h1 className="text-3xl font-serif">
            {new Date(selectedSession.createdAt).toLocaleDateString()}
          </h1>
        </div>

        <div className="relative bg-white border border-gray-200 rounded-2xl p-8 space-y-6 overflow-hidden">

          {/* WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-900 opacity-10 text-3xl md:text-4xl font-semibold tracking-widest rotate-[-25deg] select-none text-center px-6">
              PROPERTY OF SPEAR PROTOCOL - {userId}
            </p>
          </div>

          <div className="relative">

            <div>
              <p className="text-xs tracking-[0.3em] text-gray-500 mb-2">
                INPUT
              </p>
              <div className="whitespace-pre-wrap text-gray-800">
                {selectedSession.input}
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-xs tracking-[0.3em] text-gray-500 mb-2">
                OUTPUT
              </p>
              <div className="whitespace-pre-wrap text-gray-800">
                {selectedSession.output}
              </div>
            </div>

          </div>
        </div>

        <a
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-black transition"
        >
          ← Back to New Session
        </a>

      </div>
    )
  }

  /* ========================= */
  /* NEW SESSION VIEW */
  /* ========================= */

  return (
    <div className="space-y-12">
      <div className="relative bg-white border border-gray-200 rounded-2xl p-8 space-y-6 overflow-hidden">

        {/* WATERMARK (only show when output exists) */}
        {stage !== "idle" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-900 opacity-10 text-3xl md:text-4xl font-semibold tracking-widest rotate-[-25deg] select-none text-center px-6">
              PROPERTY OF SPEAR PROTOCOL - {userId}
            </p>
          </div>
        )}

        <div className="relative">

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder="DUMP_THE_CHAOS..."
            className="w-full h-60 border border-gray-300 rounded-xl p-6 text-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
          />

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`mt-4 px-8 py-3 text-xs tracking-[0.3em] uppercase rounded-full transition-all
              ${
                isProcessing
                  ? "bg-gray-400 text-white"
                  : "bg-gray-900 text-white hover:opacity-90"
              }`}
          >
            {isProcessing ? "Processing…" : "Initiate Session"}
          </button>

          {stage !== "idle" && (
            <div className="border-t pt-6 whitespace-pre-wrap text-gray-800">
              {output}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}