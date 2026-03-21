import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { email, referralCode } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      )
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      customer_email: email,

      metadata: {
        ref: referralCode || "",
      },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "SPEAR Protocol - Monthly Access",
            },
            unit_amount: 49900,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
    })

    console.log("Stripe checkout created:", session.id)

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error("Checkout session creation failed:", error)

    return NextResponse.json(
      { error: "Checkout creation failed" },
      { status: 500 }
    )
  }
}