import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription", 

    payment_method_types: ["card"],


    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "SPEAR Protocol - Monthly Access",
          },
          unit_amount: 9900,
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

  return NextResponse.json({ url: session.url })
}