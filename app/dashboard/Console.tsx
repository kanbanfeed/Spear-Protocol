"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import jsPDF from "jspdf"



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
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [stage, setStage] = useState<
    "idle" | "analyzing" | "rearchitecting" | "done"
  >("idle")

  // ✅ NEW: voice state
  const [isListening, setIsListening] = useState(false)

  const isProcessing =
    stage === "analyzing" || stage === "rearchitecting"

  
const handleVoiceInput = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser")
    return
  }

  const recognition = new SpeechRecognition()

  recognition.lang = "en-IN" // better for your region
  recognition.interimResults = true
  recognition.continuous = false

  setIsListening(true)

  recognition.start()

  let finalText = ""

  recognition.onresult = (event: any) => {
    let transcript = ""

    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript
    }

    // ✅ Always update latest full sentence (not append)
    setInput(transcript)
    finalText = transcript
  }

  recognition.onerror = (e: any) => {
    console.error("Speech error:", e)
    setIsListening(false)
  }

  recognition.onend = () => {
    setIsListening(false)

    // ✅ Ensure last captured text stays
    if (finalText) {
      setInput(finalText)
    }
  }
}

  async function handleSubmit() {
    if (!input.trim() || isProcessing) return

    setStage("analyzing")

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, email }),
      })

      if (res.status === 429) {
        alert("You have reached the hourly session limit. Please try again later.")
        setStage("idle")
        return
      }

      if (res.status === 403) {
        alert("Active subscription required.")
        window.location.href = "/"
        return
      }

      if (!res.ok) {
        alert("Session failed. Please try again.")
        setStage("idle")
        return
      }

      const data = await res.json()
      setOutput(data.output)

      await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        output: data.output,
      }),
    })

      setTimeout(() => {
        setStage("rearchitecting")
      }, 3000)

      setTimeout(() => {
        setStage("done")
      }, 7000)

    } catch (error) {
      console.error("Session request failed:", error)
      alert("Something went wrong. Please try again.")
      setStage("idle")
    }
  }

const handleListen = async () => {
  if (!output || isPlaying || isLoadingAudio) return

  setIsLoadingAudio(true)

  try {
    const res = await fetch("/api/voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: output }),
    })

    // ✅ If ElevenLabs fails → fallback
    if (!res.ok) {
      console.warn("ElevenLabs failed → using browser voice")

      const speech = new SpeechSynthesisUtterance(output.slice(0, 60000))
      speech.rate = 0.95
      speech.pitch = 1

      speech.onstart = () => {
        setIsPlaying(true)
        setIsLoadingAudio(false)
      }

      speech.onend = () => {
        setIsPlaying(false)
      }

      window.speechSynthesis.speak(speech)
      return
    }

    const blob = await res.blob()

    if (!blob || blob.size === 0) {
      throw new Error("Empty audio")
    }

    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)

    audio.onplay = () => {
      setIsPlaying(true)
      setIsLoadingAudio(false)
    }

    audio.onended = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    await audio.play()

  } catch (err) {
    console.warn("Fallback to browser TTS")

    // ✅ FINAL FALLBACK (always works)
    const speech = new SpeechSynthesisUtterance(output.slice(0, 600))
    speech.rate = 0.95

    speech.onstart = () => {
      setIsPlaying(true)
      setIsLoadingAudio(false)
    }

    speech.onend = () => {
      setIsPlaying(false)
    }

    window.speechSynthesis.speak(speech)
  }
}


const handleDownload = (text = output) => {
  if (!text) return

  const doc = new jsPDF()

  const now = new Date()
  const formattedDate = now.toISOString().split("T")[0] // YYYY-MM-DD
  const displayDate = now.toLocaleString()

  // Title
  doc.setFontSize(16)
  doc.text("SPEAR Protocol", 20, 20)

  // Date
  doc.setFontSize(10)
  doc.text(displayDate, 20, 28)

  // Line
  doc.line(20, 32, 190, 32)

  // Content
  doc.setFontSize(11)
  const lines = doc.splitTextToSize(text, 170)
  doc.text(lines, 20, 40)

  // Footer
  doc.setFontSize(9)
  doc.text(
    "Private and Confidential — SPEAR Protocol — spearprotocol.com",
    20,
    285
  )

  // Filename
  doc.save(`SPEAR-Brief-${formattedDate}.pdf`)
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
              <button
                onClick={handleListen}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
              >
                {/* Speaker Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 5.25L6 9H3.75a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75H6l5.25 3.75V5.25zM15.75 9.75a3 3 0 010 4.5m1.5-6a6 6 0 010 9"
                  />
                </svg>

                Listen
              </button>
              <button
                onClick={() => {
                  const doc = new jsPDF()
                  doc.text(selectedSession.output, 20, 20)
                  doc.save(`SPEAR-Brief-${Date.now()}.pdf`)
                }}
                className="mt-4 text-sm text-gray-600 hover:text-black"
              >
                📄 Download Brief
              </button>
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

        {stage !== "idle" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-900 opacity-10 text-3xl md:text-4xl font-semibold tracking-widest rotate-[-25deg] select-none text-center px-6">
              PROPERTY OF SPEAR PROTOCOL - {userId}
            </p>
          </div>
        )}

        <div className="relative">

          {/* ✅ TEXTAREA + MIC */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
              placeholder="DUMP_THE_CHAOS..."
              className="w-full h-60 border border-gray-300 rounded-xl p-6 pr-16 text-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
            />

            {/* ✅ MIC BUTTON */}
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isProcessing}
              className={`absolute bottom-4 right-4 p-2 rounded-full transition ${
                isListening
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              {/* SVG MIC ICON */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zm5 9a5 5 0 01-10 0M12 18v3m-3 0h6"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`mt-4 px-8 py-3 mb-4 text-xs tracking-[0.3em] uppercase rounded-full transition-all
              ${
                isProcessing
                  ? "bg-gray-400 text-white"
                  : "bg-gray-900 text-white hover:opacity-90"
              }`}
          >
            {isProcessing ? "Processing…" : "Initiate Session"}
          </button>

          {stage !== "idle" && (
            <div className="border-t pt-6 min-h-[200px] flex flex-col items-center justify-center">

              {stage !== "done" && (
                <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-blue-400/60 blur-[1px] animate-breathe-soft" />
                  <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
                    Analyzing decision structure...
                  </p>
                </div>
              )}

              {stage === "done" && (
  <div className="w-full space-y-6 animate-fadeOut">
    {/* 🔊 LISTEN BUTTON */}
    <button
      onClick={handleListen}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
    >
      {/* Speaker Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 5.25L6 9H3.75a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75H6l5.25 3.75V5.25zM15.75 9.75a3 3 0 010 4.5m1.5-6a6 6 0 010 9"
        />
      </svg>

      Listen
    </button>
    <button
      onClick={() => handleDownload(output)}     
      className="mt-4 text-sm text-gray-600 hover:text-black"
    >
      📄 Download Brief
    </button>

    {/* 📊 PROGRESS BAR */}
    {isPlaying && (
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
    <div className="whitespace-pre-wrap text-gray-800">
      {output}
    </div>

    

  </div>
)}

            </div>
          )}

        </div>
      </div>
    </div>
  )
}