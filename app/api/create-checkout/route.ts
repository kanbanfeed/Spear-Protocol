import Stripe from "stripe"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const prices: any = {
      standard: 2000,   // $20
      operator: 20000,  // $200
      verified: 75000,  // $750
    }

    const { email, plan, userId, referralCode } = await req.json()

    //  Validation
    // if (!email) {
    //   return NextResponse.json(
    //     { error: "Email is required" },
    //     { status: 400 }
    //   )
    // }

    let finalReferralCode = referralCode

// 🔁 if username passed → convert to referralCode
if (referralCode) {
  const refUser = await prisma.user.findFirst({
    where: {
      OR: [
        { referralCode },
        { username: referralCode },
      ],
    },
  })

  if (refUser) {
    finalReferralCode = refUser.referralCode
  }
}

    if (!plan || !prices[plan]) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      customer_email: email,

      //  IMPORTANT (used in webhook)
      metadata: {
        userId: userId || "guest",
        plan,
        ref: finalReferralCode || "",
      },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `SPEAR Protocol - ${plan}`,
            },
            unit_amount: prices[plan],
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?payment=cancel`,
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error("Stripe checkout error:", error)

    return NextResponse.json(
      { error: "Checkout creation failed" },
      { status: 500 }
    )
  }
}