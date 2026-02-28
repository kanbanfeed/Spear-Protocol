import SeatCounter from "@/components/SeatCounter"
import StripeCheckoutButton from "@/components/StripeCheckoutButton"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#121212]">

      {/* Top Right Dashboard Link */}
      <div className="absolute top-8 right-10">
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-wide hover:opacity-60 transition"
        >
          DASHBOARD
        </Link>
      </div>

      <div className="max-w-[900px] mx-auto px-6">

        {/* ===================== */}
        {/* ABOVE THE FOLD */}
        {/* ===================== */}

        <section className="pt-[160px] pb-[140px] text-center space-y-12">

          {/* Micro Label */}
          <p className="uppercase text-xs tracking-[0.4em] text-gray-500">
            Founding Access
          </p>

          {/* Headline */}
          <h1 className="font-serif text-[72px] md:text-[88px] leading-[1.05] tracking-tight">
            Most Strategic Errors Don’t Feel Like Errors Until It’s Too Late.
          </h1>

          {/* Subline */}
          <p className="text-[18px] text-gray-700 max-w-[720px] mx-auto leading-relaxed">
            A private adversarial filter for operators making decisions that cannot be undone.
          </p>

          {/* Daily Entitlement Line */}
          <p className="text-[17px] text-gray-900 max-w-[760px] mx-auto">
            Run up to three high-stakes decisions per day through a structured adversarial filter.
          </p>

          {/* Anchor + Price */}
          <div className="pt-8 space-y-3">
            <p className="text-[16px] text-gray-600">
              One external strategic memo typically costs $500–$5,000.
            </p>

            <p className="text-[22px] font-medium">
              $99 Initiation — 90 Days Access
            </p>
          </div>

          {/* Seat Counter */}
          <div className="pt-10 space-y-3">
            <SeatCounter />

            <p className="text-sm text-gray-600">
              Closes at 100. No reopening.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-12">
            <StripeCheckoutButton label="SECURE FOUNDING ACCESS" />
          </div>

        </section>


        {/* ===================== */}
        {/* BELOW THE FOLD */}
        {/* ===================== */}

        <section className="pb-[180px] text-center space-y-12">

          <h2 className="font-serif text-[42px] tracking-tight">
            What This Eliminates
          </h2>

          <div className="space-y-6 text-[18px] text-gray-700">
            <p>Unchallenged assumptions</p>
            <p>Politically naïve decisions</p>
            <p>Blind revenue risk</p>
            <p>Quiet strategic drift</p>
          </div>

        </section>

      </div>
    </main>
  )
}