"use client"

import { useState } from "react"
import SeatCounter from "@/components/SeatCounter"
import StripeCheckoutButton from "@/components/StripeCheckoutButton"
import Link from "next/link"
import Image from "next/image"

export default function Home() {

  const [email, setEmail] = useState("")

  return (
    <main className="min-h-screen bg-white text-[#121212] relative">

      {/* Top Left Logo */}
      <div className="absolute top-6 left-16">

        <Image
          src="/logo-desktop.jpeg"
          alt="SPEAR Protocol"
          width={120}
          height={40}
          className="hidden md:block"
          style={{ height: "auto" }}
          priority
        />

        <Image
          src="/logo-mobile.jpeg"
          alt="SPEAR Protocol"
          width={60}
          height={40}
          className="block md:hidden"
          style={{ height: "auto" }}
          priority
        />

      </div>

      {/* Top Right Dashboard Link */}
      <div className="absolute top-10 right-8">
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-wide hover:opacity-60 transition"
        >
          DASHBOARD
        </Link>
      </div>

      <div className="max-w-[900px] mx-auto px-6">

        <section className="py-24 text-center space-y-8">

          <p className="uppercase text-xs tracking-[0.2em] text-gray-500">
            PRIVATE ACCESS
          </p>

          <h1 className="font-serif text-[72px] md:text-[88px] leading-[1.05] tracking-tight">
            Most Strategic Errors Don’t Feel Like Errors Until It’s Too Late.
          </h1>

          <p className="text-[18px] text-gray-700 max-w-[720px] mx-auto ">
            A private adversarial filter for operators making decisions that cannot be undone.
          </p>

          <p className="text-[17px] text-gray-900 max-w-[760px] mx-auto">
            Run up to three critical decisions per day through a structured adversarial review.
          </p>

          <div className="space-y-1">
            <p className="text-[16px] text-gray-600">
              One external strategic memo typically costs $4,000.
            </p>

            <p className="text-[22px] font-medium">
              $99 per month - Cancel anytime.
            </p>
          </div>

          <div className=" space-y-1">
            <SeatCounter />
            <p className="text-sm text-gray-600">
              Closes at 100. No reopening.
            </p>
          </div>

          {/* EMAIL INPUT */}
          <div className="max-w-[380px] mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* CHECKOUT BUTTON */}
          <StripeCheckoutButton
            label="SECURE FOUNDING ACCESS"
            email={email}
          />

        </section>

        <section className="py-14 text-center space-y-12">

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