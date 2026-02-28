import SeatCounter from "@/components/SeatCounter"
import StripeCheckoutButton from "@/components/StripeCheckoutButton"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9F9F9] text-gray-900">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24">

        <div className="text-center max-w-3xl mx-auto space-y-8">

          <p className="text-xs tracking-[0.5em] text-gray-400">
            FOUNDING COHORT · 90 DAY SYSTEM
          </p>

          <h1 className="text-5xl md:text-6xl font-serif leading-tight">
            Initiate the <br />
            <span className="border-b-2 border-gray-900">
              SPEAR Protocol
            </span>
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            A structured cognitive re-architecture system for founders
            navigating pressure, overwhelm, and decision fatigue.
          </p>

        </div>

      </section>

      {/* VALUE STRIP */}
      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12 text-center">

          <div>
            <p className="text-sm tracking-widest text-gray-400 mb-3">
              DAILY
            </p>
            <p className="text-lg font-medium">
              Structured breakdown sessions
            </p>
          </div>

          <div>
            <p className="text-sm tracking-widest text-gray-400 mb-3">
              CLARITY
            </p>
            <p className="text-lg font-medium">
              Kill-point & pressure mapping
            </p>
          </div>

          <div>
            <p className="text-sm tracking-widest text-gray-400 mb-3">
              ACCOUNTABILITY
            </p>
            <p className="text-lg font-medium">
              90-day founder discipline cycle
            </p>
          </div>

        </div>
      </section>

      {/* INITIATION SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-24">

        <div className="bg-white border border-gray-200 rounded-3xl p-12 shadow-sm text-center space-y-10">

          <div>
            <p className="text-xs tracking-[0.4em] text-gray-400 mb-4">
              ONE-TIME INITIATION
            </p>

            <p className="text-4xl font-serif">$99</p>
          </div>

          <SeatCounter />

          <div className="pt-6">
            <StripeCheckoutButton />
          </div>

          <p className="text-xs text-gray-500 tracking-wide">
            Access unlocks the full session console, referral system,
            and 90-day structured protocol.
          </p>

        </div>

      </section>

      {/* FOOTER NOTE */}
      <section className="pb-20 text-center text-sm text-gray-400">
        <p>
          Built for founders who refuse to operate unconsciously.
        </p>
      </section>

    </main>
  )
}