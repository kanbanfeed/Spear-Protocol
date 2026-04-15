import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import "./globals.css"
import Providers from "./providers"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "SPEAR Protocol",
  description:
    "SPEAR Protocol is a structured 60-minute decision ritual for growth-stage operators.",
  metadataBase: new URL("http://localhost:3000"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-[#F9F9F9]">
      <body
        className={`${geist.variable} ${playfair.variable} bg-[#F9F9F9] text-[#1A1A1A] antialiased`}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  )
}