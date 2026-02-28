import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"],

  customer_creation: "always", 
  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "SPEAR Protocol - Founding Access",
        },
        unit_amount: 9900,
      },
      quantity: 1,
    },
  ],
  success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
})

  return NextResponse.json({ url: session.url })
}