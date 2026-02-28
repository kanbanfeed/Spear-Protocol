import SeatCounter from "@/components/SeatCounter"
import StripeCheckoutButton from "@/components/StripeCheckoutButton"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-white to-[#f0f0f0] relative overflow-hidden">

      {/* Subtle Background Accent */}
      <div className="absolute -top-20 -left-32 w-[500px] h-[500px] bg-gray-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gray-300 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-4">

        {/* HERO SECTION */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div className="space-y-8">

            <p className="text-xs tracking-[0.5em] text-gray-400">
              FOUNDING ACCESS
            </p>

            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 leading-tight">
              INITIATE <br />
              <span className="border-b-2 border-gray-900">
                SPEAR PROTOCOL
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-md">
              A structured 90-day cognitive rearchitecture system 
              for founders and operators navigating pressure, scale,
              and internal resistance.
            </p>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500">
                  One-Time Initiation
                </p>
                <p className="text-3xl font-semibold text-gray-900">
                  $99
                </p>
              </div>

              <div className="h-10 w-px bg-gray-300" />

              <SeatCounter />
            </div>

            <div className="pt-6">
              <StripeCheckoutButton />
            </div>

          </div>

          {/* RIGHT SIDE CARD */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-xl space-y-6 backdrop-blur-sm">

            <h2 className="text-2xl font-serif text-gray-900">
              What You Unlock
            </h2>

            <ul className="space-y-4 text-gray-700 text-[15px] leading-relaxed">
              <li className="flex gap-3">
                <span>•</span>
                <span>Daily structured cognitive breakdown sessions</span>
              </li>
              <li className="flex gap-3">
                <span>•</span>
                <span>Pressure mapping & decision clarity protocol</span>
              </li>
              <li className="flex gap-3">
                <span>•</span>
                <span>Kill-point identification framework</span>
              </li>
              <li className="flex gap-3">
                <span>•</span>
                <span>90-Day Founding Cohort Access</span>
              </li>
            </ul>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 tracking-wide">
                LIMITED FOUNDING ACCESS
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  )
}