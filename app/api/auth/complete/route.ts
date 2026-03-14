import Stripe from "stripe"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    console.warn("Checkout complete called without session_id")
    return NextResponse.redirect(new URL("/", req.url))
  }

  try {
    // Retrieve Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    let email = session.customer_email

    // fallback: fetch email from Stripe customer
    if (!email && session.customer) {
      const customer = await stripe.customers.retrieve(
        session.customer as string
      )

      if (!("deleted" in customer)) {
        email = customer.email
      }
    }

    if (!email) {
      console.error("Checkout complete: email not found")
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Optional: verify user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.warn("Checkout complete: user not found in DB:", email)
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Set login cookie
    const response = NextResponse.redirect(
      new URL("/dashboard", req.url)
    )

    response.cookies.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    console.log("User login after checkout:", email)

    return response
  } catch (error) {
    console.error("Checkout completion error:", error)

    return NextResponse.redirect(new URL("/", req.url))
  }
}