"use client"

import { useState } from "react"

export default function DashboardLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9F9F9] md:flex relative">

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl"
        >
          ☰
        </button>

        <p className="text-sm tracking-[0.3em] text-gray-500">
          SPEAR PROTOCOL
        </p>

        <div />
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 overflow-y-auto md:hidden">
            <div className="p-6 flex justify-end">
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            {sidebar}
          </div>
        </>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        {sidebar}
      </div>

      {/* MAIN */}
      <div className="flex-1 md:ml-80">
        {children}
      </div>

    </div>
  )
}