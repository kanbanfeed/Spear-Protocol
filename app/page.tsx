import SeatCounter from "@/components/SeatCounter"
import StripeCheckoutButton from "@/components/StripeCheckoutButton"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#121212]">

      {/* Dashboard Link */}
      <div className="absolute top-8 right-8">
        <Link
          href="/dashboard"
          className="text-sm font-medium tracking-wide hover:opacity-60 transition"
        >
          DASHBOARD
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-[900px] mx-auto px-6">

        {/* Above Fold */}
        <section className="pt-20 pb-32 text-center space-y-16 animate-fadeIn">

          {/* Micro Label */}
          <p className="uppercase text-xs tracking-[0.4em]">
            Founding Access
          </p>

          {/* Headline */}
          <h1
            className="font-serif leading-[1.05]"
            style={{
              fontSize: "clamp(72px, 8vw, 96px)",
            }}
          >
            Most Strategic Errors Don’t Feel Like Errors Until It’s Too Late.
          </h1>

          {/* Subline */}
          <p className="text-lg max-w-2xl mx-auto">
            SPEAR Protocol is a private adversarial filter for high-stakes operators.
          </p>

          {/* Offer */}
          <p className="text-lg">
            $99 Initiation — 90 Days Access
          </p>

          {/* Seat Counter */}
          <div className="text-lg">
            <SeatCounter />
          </div>

          {/* CTA */}
          <div className="pt-4">
            <StripeCheckoutButton />
          </div>

        </section>

        {/* Massive whitespace between sections */}
        <div className="h-[140px]" />

        {/* Below Fold */}
        <section className="pb-40 text-center space-y-20">

          <h2 className="font-serif text-4xl">
            What This Eliminates
          </h2>

          <div className="space-y-10 text-lg">

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