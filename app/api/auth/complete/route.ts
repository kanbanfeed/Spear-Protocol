import Stripe from "stripe"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    let email = session.customer_email

    if (!email && session.customer) {
      const customer = await stripe.customers.retrieve(
        session.customer as string
      )

      if (!("deleted" in customer)) {
        email = customer.email
      }
    }

    if (!email) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    const response = NextResponse.redirect(
      new URL("/dashboard", req.url)
    )

    response.cookies.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url))
  }
}