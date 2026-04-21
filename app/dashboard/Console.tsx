"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import jsPDF from "jspdf"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaFacebook, FaLinkedin, FaDiscord, FaReddit, FaApple } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { MdEmail } from "react-icons/md"
import { FaInstagram, FaWhatsapp, FaSnapchatGhost, FaYoutube } from "react-icons/fa"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { auth } from "@/lib/firebase"
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"

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
  const { data: session } = useSession()
  useEffect(() => {
  const openLogin = () => setShowLoginModal(true)

  window.addEventListener("open-login", openLogin)

  return () => {
    window.removeEventListener("open-login", openLogin)
  }
}, [])
  
  useEffect(() => {
  if (session?.user) {
    setIsUnlocked(true)
    setLoginType("social")

    fetch("/api/unlock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "social",
        userId: session.user.id,
      }),
    })
  }
}, [session])
  const referralLink =
  session?.user
    ? `${process.env.NEXT_PUBLIC_URL}/ref/${encodeURIComponent(
        session.user.username ||
        session.user.referralCode ||
        ""
      )}`
    : ""
  const selectedSession = sessions.find(
    (s) => s.id === selectedId
  )
  const [shareSuccess, setShareSuccess] = useState(false)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [stage, setStage] = useState<
    "idle" | "analyzing" | "rearchitecting" | "done"
  >("idle")
  const [guestRuns, setGuestRuns] = useState(1)
  const [isListening, setIsListening] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [loginType, setLoginType] = useState<"social" | "email" | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [showShareGate, setShowShareGate] = useState(false)
  const [showEmailPopup, setShowEmailPopup] = useState(false)
const [sessionId, setSessionId] = useState<string | null>(null)
const [storedRef, setStoredRef] = useState<string | null>(null)

useEffect(() => {
  if (typeof window !== "undefined") {
    const ref = localStorage.getItem("referralCode")
    setStoredRef(ref)
  }
}, [])

useEffect(() => {
  const paymentStatus = searchParams.get("payment")

  if (paymentStatus === "success") {
    setShowEmailPopup(true)
  }
}, [searchParams])

useEffect(() => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href)
    const id = url.searchParams.get("session_id")
    setSessionId(id)
  }
}, [])
  
  
  
  const isProcessing =
    stage === "analyzing" || stage === "rearchitecting"
  const [showLoginModal, setShowLoginModal] = useState(false)
  useEffect(() => {
  const used = localStorage.getItem("guest_used")

  if (used === "true") {
    setGuestRuns(0)
  }
}, [])
    useEffect(() => {
  if (stage === "done" && isUnlocked) {
    setShowShareGate(true)
  }
}, [stage, isUnlocked])
const [verifying, setVerifying] = useState(false)
  
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

    //  Always update latest full sentence (not append)
    setInput(transcript)
    finalText = transcript
  }

  recognition.onerror = (e: any) => {
    console.error("Speech error:", e)
    setIsListening(false)
  }

  recognition.onend = () => {
    setIsListening(false)

    //  Ensure last captured text stays
    if (finalText) {
      setInput(finalText)
    }
  }
}

  async function handleSubmit() {
    
    if (!session?.user && guestRuns <= 0) {
      alert("Login to run another decision")
      window.dispatchEvent(new Event("open-login"))
      return
    }
    
    if (!input.trim() || isProcessing) return
    setStage("analyzing")

    if (!session?.user) {
      setGuestRuns((prev) => prev - 1)
    }
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          userId: session?.user?.id || null
        }),
      })
      
      if (res.status === 429) {
        alert("You have reached the hourly session limit. Please try again later.")
        setStage("idle")
        return
      }
      

      
      if (res.status === 403) {
        alert("Free limit reached. Please share or upgrade.")
        return
      }

      // if (res.status === 403) {
      //   alert("Active subscription required.")
      //   window.location.href = "/"
      //   return
      // }

      if (!res.ok) {
        alert("Session failed. Please try again.")
        setStage("idle")
        return
      }

      const data = await res.json()
      setOutput(data.output)
      localStorage.setItem("last_output", data.output)

      //  mark guest as used
      if (!session?.user) {
        setGuestRuns(0)
        localStorage.setItem("guest_used", "true")
      }

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
  useEffect(() => {
  const saved = localStorage.getItem("last_output")
  if (saved) {
    setOutput(saved)
    setStage("done")
  }
}, [])

const handleListen = async (textToRead?: string) => {
  window.speechSynthesis.cancel()
setAudioInstance(null)
setSpeechInstance(null)
setIsPaused(false)
  const text = textToRead || output

  if (!text || isPlaying || isLoadingAudio) return

  setIsLoadingAudio(true)

  try {
    const res = await fetch("/api/voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!res.ok) {
      const speech = new SpeechSynthesisUtterance(text.slice(0, 6000))

setSpeechInstance(speech)

speech.rate = 0.95

speech.onstart = () => {
  setIsPlaying(true)
  setIsLoadingAudio(false)
}

speech.onend = () => {
  setIsPlaying(false)
  setIsPaused(false)
}

window.speechSynthesis.cancel() // important
window.speechSynthesis.speak(speech)
return
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    setAudioInstance(audio)
    setIsPaused(false)

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
    const speech = new SpeechSynthesisUtterance(text.slice(0, 6000))
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

const handlePause = () => {
  if (audioInstance && isPlaying) {
    audioInstance.pause()
  } else {
    if (speechInstance) {
      window.speechSynthesis.pause()
    }
  }

  setIsPaused(true)
  setIsPlaying(false)
}

const handleResume = () => {
  if (audioInstance && isPaused) {
    audioInstance.play()
  } else if (speechInstance) {
    window.speechSynthesis.resume()
  }

  setIsPaused(false)
  setIsPlaying(true)
}
const handleDownload = (text = output, createdAt?: string) => {
  if (!text) return

  const doc = new jsPDF()

  const dateObj = createdAt ? new Date(createdAt) : new Date()
  const formattedDate = dateObj.toISOString().split("T")[0]
  const displayDate = dateObj.toLocaleString()

  const img = new Image()
  img.src = "/logo-desktop.jpeg"

  img.onload = () => {
    //  LOGO
    doc.addImage(img, "JPEG", 20, 10, 40, 15)

    // Title
    doc.setFontSize(16)
    doc.text("SPEAR Protocol", 20, 30)

    // Date
    doc.setFontSize(10)
    doc.text(displayDate, 20, 38)

    // Line
    doc.line(20, 42, 190, 42)

    // Content
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(text, 170)
    doc.text(lines, 20, 50)

    // Footer
    doc.setFontSize(9)
    doc.text(
      "Private and Confidential — SPEAR Protocol — spearprotocol.com",
      20,
      285
    )

    // Save
    doc.save(`SPEAR-Brief-${formattedDate}.pdf`)
  }
}
const splitOutput = (text: string) => {
  const phase1Match = text.match(/PHASE I[\s\S]*?(?=PHASE II)/i)
  const phase2Match = text.match(/PHASE II[\s\S]*?(?=PHASE III)/i)
  const phase3Match = text.match(/PHASE III[\s\S]*/i)

  const phase1 = phase1Match ? phase1Match[0].trim() : ""
  const phase2 = phase2Match ? phase2Match[0].trim() : ""
  const phase3 = phase3Match ? phase3Match[0].trim() : ""

  //  SAFETY FALLBACK (VERY IMPORTANT)
  if (!phase1 || !phase2 || !phase3) {
    return {
      phase1: text,   // show full output instead of breaking UI
      phase2: "",
      phase3: "",
    }
  }

  return { phase1, phase2, phase3 }
}


const handlePhoneLogin = async () => {
  try {
    const phone = prompt("Enter phone number with country code (+91...)")
    if (!phone) return

    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear()
      } catch (e) {
        console.warn("Recaptcha cleanup failed")
      }
      ;(window as any).recaptchaVerifier = null
    }

    ;(window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    )

    const appVerifier = (window as any).recaptchaVerifier

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      appVerifier
    )

    const otp = prompt("Enter OTP")
    if (!otp) return

    const result = await confirmationResult.confirm(otp)

    if (result.user) {
      await fetch("/api/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: result.user.phoneNumber,
          platform: "phone",
          name: "Phone User",
        }),
      })

      setIsUnlocked(true)
      setLoginType("social")
      setShowShareGate(true)

      alert("Login successful")
    }
  } catch (error: any) {
  console.error(error)

  if (error.code === "auth/invalid-phone-number") {
    alert("Invalid phone number format")
  } else if (error.code === "auth/too-many-requests") {
    alert("Too many attempts. Try later.")
  } else if (error.code === "auth/quota-exceeded") {
    alert("OTP limit reached. Try later.")
  } else {
    alert("OTP failed. Please try again.")
  }
}
}

const handleCheckout = async (plan: string) => {
  if (!session?.user?.email || !session?.user?.id) {
  alert("Please login first")
  return
}
const referralCode = localStorage.getItem("referralCode")
  try {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user.email,
        plan,
        userId: session?.user.id,
        referralCode,
      }),
    })

    const data = await res.json()
    

    if (data.url) {
      window.location.href = data.url
    }
   
  } catch (err) {
    alert("Checkout failed")
  }
}

const handleEmailLogin = async () => {
  const email = prompt("Enter your email")
  if (!email) return

  setUserEmail(email)
  setLoginType("email")

  await fetch("/api/unlock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "email",
      email,
      output,
    }),
  })
}

const handleShareVerify = async () => {
  if (!shareUrl) {
    alert("Please paste your post URL")
    return
  }

  if (!session?.user?.id) {
    alert("Please login first")
    return
  }

  try {
    setVerifying(true)

    const res = await fetch("/api/share-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        url: shareUrl,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.message)
    }

    setShareSuccess(true)
    setShareUrl("")
    setGuestRuns(1)
    localStorage.removeItem("guest_used")
  } catch (err: any) {
    alert(err.message)
  } finally {
    setVerifying(false)
  }
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
            {session?.user?.image && (
              <img
                src={session.user.image}
                className="w-8 h-8 rounded-full"
              />
            )}

            <div className="border-t pt-6">
              <div className="flex justify-center items-center gap-12">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleListen(selectedSession?.output || output)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  🔊 Listen
                </button>

                {isPlaying && (
                  <button
                    onClick={handlePause}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    ⏸ Pause
                  </button>
                )}

                {isPaused && (
                  <button
                    onClick={handleResume}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    ▶ Resume
                  </button>
                )}
              </div>
              <button
                onClick={() =>
                  handleDownload(
                    selectedSession.output,
                    selectedSession.createdAt
                  )
                }
                className=" text-sm text-gray-600 hover:text-black"
              >
                📄 Download Brief
              </button>
              </div>
              <p className="text-xs mt-8 tracking-[0.3em] text-gray-500 mb-2">
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
      <div id="recaptcha-container"></div>
      <div className="relative bg-white border border-gray-200 rounded-2xl p-8 space-y-6 overflow-hidden">

        {stage !== "idle" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-900 opacity-10 text-3xl md:text-4xl font-semibold tracking-widest rotate-[-25deg] select-none text-center px-6">
              PROPERTY OF SPEAR PROTOCOL - {userId}
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-2">
          Share your link. When someone upgrades through your link — you get that tier free plus 30% of what they pay. Every month. Forever.
        </p>
        {storedRef && (
          <p className="text-xs text-green-600 mb-2">
            You were invited via a referral link ✔
          </p>
        )}
        <div className="border p-4 rounded-xl mt-6">
          <p className="text-sm font-medium mb-2">Your Referral Link</p>

          <div className="flex gap-2">
            <input
              value={referralLink}
              readOnly
              className="flex-1 border p-2 text-sm rounded"
            />

            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink)
                alert("Referral link copied")
              }}
              className="bg-black text-white px-4 text-sm rounded"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="relative">

          {/*  TEXTAREA + MIC */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
              placeholder="Describe your situation."
              className="w-full h-60 border border-gray-300 rounded-xl p-6 pr-16 text-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
            />

            {/*  MIC BUTTON */}
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
          <p className="text-s text-gray-400 mt-2 text-center">
            No card. No login. Just clarity.
          </p>
          {shareSuccess && (
            <p className="text-green-600 text-center mt-2">
               Free session unlocked successfully
            </p>
          )}
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
                  <div className="flex justify-center items-center gap-12">
                  <div className="flex items-center gap-4">
                <button
                  onClick={() => handleListen(selectedSession?.output || output)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  🔊 Listen
                </button>

                {isPlaying && (
                  <button
                    onClick={handlePause}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    ⏸ Pause
                  </button>
                )}

                {isPaused && (
                  <button
                    onClick={handleResume}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    ▶ Resume
                  </button>
                )}
              </div>
                  {session?.user && (
                    <button
                      onClick={() => handleDownload(output)}     
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      📄 Download Brief
                    </button>
                  )}
                  </div>
                  

                  {/* 📊 PROGRESS BAR */}
                  {isPlaying && (
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                  {(() => {
                const { phase1, phase2, phase3 } = splitOutput(output)

                return (
                  <div className="space-y-6">

                    {/* Phase I */}
                    <div className="whitespace-pre-wrap text-gray-800">
                      {phase1}
                    </div>

                    {/* Phase II */}
                    <div className="whitespace-pre-wrap text-gray-800">
                      {phase2}
                    </div>

                    {/* Phase III */}
                    {!isUnlocked ? (
                      <div className="relative">
                        <div className="blur-sm whitespace-pre-wrap text-gray-800">
                          {phase3}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-center px-6">
                          <p className="text-sm text-gray-900">
                            Your Kill Point has been identified. Log in to unlock your full Decision Matrix and download your brief.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-gray-800">
                        {phase3}
                      </div>
                    )}

                    {/* LOGIN OPTIONS */}
                    {!isUnlocked && (
                      <>
                      <p className="text-center text-sm font-medium mt-4">
                        Continue to unlock your full Decision Matrix
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                          <button disabled onClick={() => signIn("linkedin", { redirect: false })} className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaLinkedin className="text-blue-600" />  LinkedIn Coming Soon
                          </button>

                          <button onClick={() => signIn("google", { redirect: false })} className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FcGoogle /> Continue with Google
                          </button>

                          <button disabled onClick={() => signIn("twitter", { redirect: false })} className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaXTwitter />  X Coming Soon
                          </button>

                          <button onClick={() => signIn("github", { redirect: false })} className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaGithub /> Continue with GitHub
                          </button>

                          <button onClick={() => signIn("discord", { redirect: false })} className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaDiscord className="text-indigo-600" /> Continue with Discord
                          </button>

                          <button disabled onClick={() => signIn("reddit", { redirect: false })} className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaReddit className="text-orange-500" /> Reddit Coming Soon
                          </button>

                          <button disabled onClick={() => signIn("apple", { redirect: false })} className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaApple /> Apple Coming Soon
                          </button>

                          <button disabled onClick={() => signIn("facebook", { redirect: false })} className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaFacebook className="text-blue-700" />  Facebook Coming Soon
                          </button>

                          {/* Disabled Platforms */}

                          <button className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaInstagram /> Instagram Coming Soon
                          </button>
                          <>
                          <button
                            onClick={handlePhoneLogin}
                            className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50"
                          >
                            <FaWhatsapp /> Continue with WhatsApp
                          
                          </button>
                          </>

                          <button className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaSnapchatGhost />Snapchat Coming Soon
                          </button>

                          <button  className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <FaYoutube /> YouTube Coming Soon
                          </button>

                          <button className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            ❓ Quora Coming Soon
                          </button>

                          {/* Email */}

                          <button onClick={handleEmailLogin} className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50">
                            <MdEmail /> Continue with email
                          </button>

                        </div>
                      </>
                    )}

                    {/* EMAIL MESSAGE */}
                    {loginType === "email" && (
                      <p className="text-center mt-4 text-sm">
                        Your full Decision Matrix and downloadable brief have been sent to {userEmail}. Check your inbox.
                      </p>
                    )}

                    {/* SHARE GATE */}
                    {showShareGate && (
                      <div className="mt-8 border-t pt-6 space-y-4">

                        <p className="text-center font-medium">
                          Want to run another decision free? Share this moment.
                        </p>

                        <textarea
                          readOnly
                          className="w-full border p-3 text-sm"
                          value="Just ran a high-stakes decision through SPEAR Protocol. The Kill Point it identified stopped me cold. If you make decisions under pressure — try it free. spearprotocol.com @spearprotocol"
                        />

                        <input
                          value={shareUrl}
                          onChange={(e) => setShareUrl(e.target.value)}
                          placeholder="Paste the link to your post here"
                          className="w-full border p-2 text-sm"
                        />

                        <button
                          onClick={handleShareVerify}
                          disabled={verifying}
                          className="bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
                        >
                          {verifying ? "Verifying..." : "Verify and unlock my next session"}
                        </button>

                        {shareSuccess && (
                          <p className="text-green-600 text-center mt-2">
                            Free session unlocked
                          </p>
                        )}

                        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

                          <div className="border p-4 rounded-lg">
                            <h3 className="font-semibold">Standard</h3>
                            <p className="text-sm">$20/month</p>
                            <button
                              onClick={() => handleCheckout("standard")}
                              className="mt-3 w-full bg-black text-white py-2"
                            >
                              Choose Plan
                            </button>
                          </div>

                          <div className="border p-4 rounded-lg bg-black text-white">
                            <h3 className="font-semibold">Operator</h3>
                            <p className="text-sm">$200/month</p>
                            <button
                              onClick={() => handleCheckout("operator")}
                              className="mt-3 w-full bg-white text-black py-2"
                            >
                              Choose Plan
                            </button>
                          </div>

                          <div className="border p-4 rounded-lg">
                            <h3 className="font-semibold">Verified</h3>
                            <p className="text-sm">$750/month</p>
                            <button
                              onClick={() => handleCheckout("verified")}
                              className="mt-3 w-full bg-black text-white py-2"
                            >
                              Choose Plan
                            </button>
                          </div>

                        </div>

                      </div>
                    )}

                  </div>
                )
              })()
              }   
              </div>
              )}
              </div>
              )}
{showEmailPopup && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md text-black">
      <h2 className="text-lg font-bold mb-4">
        Confirm your email to activate access
      </h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full border p-2 rounded mb-4"
        id="paymentEmail"
      />

      <button
        onClick={async () => {
  if (!sessionId) {
    alert("Invalid session. Please retry payment.")
    return
  }

  const email = (document.getElementById("paymentEmail") as HTMLInputElement).value

  if (!email) {
    alert("Please enter email")
    return
  }

  const res = await fetch("/api/activate-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, sessionId }),
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.error || "Activation failed")
    return
  }

  alert("Subscription activated successfully")

  setShowEmailPopup(false)
}}
        className="w-full bg-amber-500 text-black py-2 rounded"
      >
        Confirm & Activate
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  )
}