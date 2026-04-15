"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import SeatCounter from "@/components/SeatCounter" // Adjust path as needed
import StripeCheckoutButton from "@/components/StripeCheckoutButton" // Adjust path as needed

export default function Home() {
  const [email, setEmail] = useState("")
  const [isPulsing, setIsPulsing] = useState(false)

  // Simulate real-time seat counter pulsing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 1000)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-[#020617] text-white relative overflow-x-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#020617] via-[#0A0F2A] to-[#020617] opacity-100"></div>

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.5),transparent_70%)]"></div>
      
      {/* Animated Grid Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b20_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b20_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* NAVIGATION BAR - Premium */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex justify-between items-center">
          {/* Logo with Image */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-16 h-16">
              <Image
                src="/logo-desktop.jpeg"
                alt="SPEAR Protocol Logo"
                fill
                className="object-contain rounded-lg"
                priority
              />
              {/* Pulsing Ring */}
              <div className="absolute inset-0 rounded-lg bg-amber-500/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                SPEAR
              </span>
              <span className="text-[10px] md:text-xs tracking-[0.2em] text-amber-500/70 -mt-1">
                PROTOCOL
              </span>
            </div>
          </Link>
          
          {/* <Link
            href="/dashboard"
            className="relative px-5 py-2 text-sm font-medium tracking-wide text-white/70 hover:text-white transition-all duration-300 group"
          >
            TRY FOR FREE NOW
            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-500 group-hover:w-full transition-all duration-300"></span>
          </Link> */}
        </div>
      </nav>

      {/* SECTION 1 — ABOVE THE FOLD - Premium Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 mt-18">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Animated Badge */}
          <div className="mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs tracking-[0.2em] text-amber-400 uppercase font-medium">
                PRIVATE ACCESS — 50 FOUNDING SEATS REMAINING
              </span>
            </div>
          </div>

          {/* Main Headline with Gradient */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-4xl lg:text-5xl leading-[1] tracking-tight max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Most strategic errors don't feel like errors
            <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">until it's too late.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-4 text-white/70 text-lg md:text-xl  mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            A private decision instrument for operators making decisions that cannot be undone.
          </p>

          {/* Divider with Glow */}
          <div className="relative w-20 h-px mx-auto mt-2">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent blur-sm"></div>
          </div>

          {/* Three Lines */}
          <div className="space-y-1 text-white/90 text-base md:text-lg max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <p className="hover:text-amber-400 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit a high-stakes situation.
            </p>
            <p className="hover:text-amber-400 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Receive a structured adversarial analysis in minutes.
            </p>
            <p className="hover:text-amber-400 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Know what you are avoiding before it costs you everything.
            </p>
          </div>

          {/* Divider */}
          <div className="relative w-20 h-px mx-auto my-2">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>

          {/* Price Block with Premium Styling */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <p className="text-sm text-white/40 tracking-wide">
              One external strategic advisory session costs $4,000.
            </p>
            {/* <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                $499
              </span>
              <span className="text-white/60 text-lg">per month.</span>
              <span className="text-white/40 text-sm">Cancel anytime.</span>
            </div> */}
          </div>

          {/* DYNAMIC SEAT COUNTER */}
          <div className="mt-2 mb-4 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <SeatCounter isPulsing={isPulsing} />
          </div>

          {/* Email Input with Premium Design */}
          

          {/* DESKTOP FLOATING CTA */}
<div className="fixed bottom-6 right-6 z-50 hidden md:block">
  <button
    onClick={() => window.location.href = "/dashboard"}
    className="
      bg-amber-500 text-black px-6 py-3 rounded-full font-bold
      shadow-lg opacity-90 backdrop-blur
      animate-[pulse_3s_infinite]
    "
  >
    TRY FOR FREE NOW
  </button>
</div>

{/* MOBILE FLOATING CTA */}
<div className="fixed bottom-0 left-0 w-full p-4 bg-black/40 backdrop-blur md:hidden z-50">
  <button
    onClick={() => window.location.href = "/dashboard"}
    className="
      w-full bg-amber-500 text-black py-4 rounded-full font-bold
      animate-[pulse_3s_infinite]
    "
  >
    TRY FOR FREE NOW
  </button>
</div>

          <div className="mt-10 max-w-md mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email to secure access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-focus-within:from-amber-500/10 group-focus-within:via-amber-500/5 group-focus-within:to-transparent pointer-events-none transition-all duration-500"></div>
            </div>
          </div>

          {/* Small Muted Text */}
          <p className="text-xs text-white/30 mt-6 animate-in fade-in duration-700 delay-800">
            Used by operators under real pressure. Not a productivity tool.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
      <section className="relative py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-serif mb-12">
            Access Options
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {/* FREE */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="mt-2 text-white/60 text-sm">
                Your first decision. No login required.
              </p>

              <Link href="/dashboard">
                <button className="mt-4 w-full bg-white text-black py-2 rounded-md">
                  TRY FOR FREE
                </button>
              </Link>
            </div>

            {/* STANDARD */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold">Standard</h3>
              <p className="mt-2 text-white/60 text-sm">
                $20/month. Unlimited decisions.
              </p>

              <StripeCheckoutButton
                label="GET STANDARD"
                email={email}
                plan="standard"
              />
            </div>

            {/* OPERATOR */}
            <div className="bg-amber-500 text-black p-6 rounded-xl scale-105 shadow-xl">
              <h3 className="text-lg font-semibold">Operator</h3>
              <p className="mt-2 text-sm">
                $200/month. Deeper analysis.
              </p>

              <StripeCheckoutButton
                label="GET OPERATOR"
                email={email}
                plan="operator"
              />
            </div>

            {/* VERIFIED */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold">Verified</h3>
              <p className="mt-2 text-white/60 text-sm">
                $750/month. Expert reviewed.
              </p>

              <StripeCheckoutButton
                label="GET VERIFIED"
                email={email}
                plan="verified"
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — WHAT IT ELIMINATES - Premium Cards with Modern Icons */}
      <section className="relative py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.2em] text-amber-400 uppercase font-semibold bg-amber-500/10 px-4 py-2 rounded-full inline-block">
              WHAT THIS ELIMINATES
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Unchallenged assumptions",
                desc: "The belief you have considered every angle. You have not.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                )
              },
              {
                title: "Politically naive decisions",
                desc: "Moves that are structurally correct but destroy relationships or boards.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Blind revenue risk",
                desc: "Decisions made without mapping the financial consequence of being wrong.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 5.25v10.5a.75.75 0 001.5 0V5.25a.75.75 0 00-1.5 0zM9.75 5.25v10.5a.75.75 0 001.5 0V5.25a.75.75 0 00-1.5 0zM15.75 5.25v10.5a.75.75 0 001.5 0V5.25a.75.75 0 00-1.5 0z" />
                  </svg>
                )
              },
              {
                title: "Quiet strategic drift",
                desc: "The slow divergence from what actually matters. Invisible until it is not.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M3 6.75h18M4.5 6.75v12.75a.75.75 0 001.5 0V6.75M6.75 3.75h10.5a.75.75 0 01.75.75v.75" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <div key={i} className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-amber-500/5 transition-all duration-500"></div>
                <div className="relative">
                  <div className="text-amber-500 mb-4 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS - Premium */}
      <section className="relative py-28 px-6 bg-gradient-to-b from-[#0A0F2A] to-[#020617] border-t border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-serif text-3xl md:text-5xl text-center mb-16 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            THREE PHASES. ONE SESSION.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                phase: "PHASE I — THE POUR",
                desc: "Your situation restructured. Emotion removed. The real tension named.",
                number: "01"
              },
              {
                phase: "PHASE II — THE KILL POINT",
                desc: "The one thing you have not admitted to yourself. Named directly.",
                number: "02"
              },
              {
                phase: "PHASE III — DECISION MATRIX",
                desc: "Three paths. Each with three concrete steps. No vague advice.",
                number: "03"
              }
            ].map((item, i) => (
              <div key={i} className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-6 right-6 text-5xl font-bold text-amber-500/10 group-hover:text-amber-500/20 transition-all duration-500">
                  {item.number}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 mb-6 flex items-center justify-center text-black font-bold">
                    {item.number}
                  </div>
                  <h3 className="text-xl font-bold text-amber-400 mb-4">
                    {item.phase}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-white/40 mt-16 text-sm tracking-wide">
            Delivered in minutes. Reviewed in private. Acted on immediately.
          </p>
        </div>
      </section>

      {/* SECTION 4 — WHO THIS IS FOR - Premium */}
      <section className="relative py-28 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-serif text-3xl md:text-5xl text-center mb-16 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            THIS IS FOR YOU IF
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              "You are facing a decision that cannot be undone.",
              "You are under investor, board, or market pressure right now.",
              "You cannot afford to think about this wrong.",
              "You do not have three weeks to wait for an advisor.",
              "You want clarity, not reassurance."
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                </div>
                <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent h-px"></div>
            <div className="h-px bg-white/10 my-12"></div>
          </div>

          <h3 className="text-2xl font-serif mb-8 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            THIS IS NOT FOR YOU IF
          </h3>

          <div className="space-y-4">
            {[
              "You are looking for validation of a decision already made.",
              "You want someone to soften the truth.",
              "You are not currently under real pressure."
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-white/40"></div>
                </div>
                <p className="text-white/50 group-hover:text-white/70 transition-colors">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — FINAL CTA BLOCK - Premium Urgency */}
      <section className="relative py-28 px-6 bg-gradient-to-b from-[#0A0F2A] to-[#020617] border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1),transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs tracking-wide text-amber-400 uppercase font-medium">Limited Availability</span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-6">
            50 founding seats. <span className="text-amber-400">When they close, they close.</span>
          </h2>

          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            When the founding round closes, new access opens at a higher price with no founding guarantee.
          </p>

          <Link href="/dashboard">
            <button className="
               w-full overflow-hidden 
        bg-gradient-to-r from-amber-500 to-amber-600 
        text-black font-bold py-5 px-10 rounded-xl text-xl md:text-xl
        animate-[pulse_3s_infinite]
        transition-all duration-300 hover:scale-[1.02] 
        hover:shadow-2xl hover:shadow-amber-500/30 
        active:scale-[0.98]
            ">
              TRY FOR FREE NOW
            </button>
          </Link>
        </div>
      </section>

      {/* SECTION 6 — FOOTER - Premium */}
      <footer className="relative border-t border-white/5 bg-[#020617] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-500/50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4 L24 12 L20 10 L16 12 L20 4Z" fill="#F59E0B"/>
              <rect x="19" y="10" width="2" height="20" fill="#F59E0B"/>
              <rect x="17" y="30" width="6" height="2" fill="#F59E0B"/>
            </svg>
            <span className="text-white/30 hover:text-white/50 transition-colors">
              SPEAR Protocol — A Crowbar Ventures Instrument
            </span>
          </div>
          
          <div className="flex gap-8">
            <div className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer">
              spearprotocol.com
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="text-white/30 hover:text-white/50 transition-colors">
              Private and Confidential
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}