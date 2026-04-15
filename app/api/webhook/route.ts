import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendWelcomeEmail } from "@/lib/sendWelcomeEmail"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const sig = headerList.get("stripe-signature")

  if (!sig) {
    console.error("❌ Missing Stripe signature")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("❌ Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("✅ Webhook received:", event.type)

  try {
    // ===============================
    // ✅ CHECKOUT COMPLETED
    // ===============================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      let email = session.customer_email

      // fallback if email missing
      if (!email && session.customer) {
        const customer = await stripe.customers.retrieve(
          session.customer as string
        )

        if (!("deleted" in customer)) {
          email = customer.email
        }
      }

      if (!email) {
        console.error("❌ Email not found")
        return NextResponse.json({ received: true })
      }

      const referralUsed = session.metadata?.ref || null
      const plan = session.metadata?.plan || "standard" // ✅ IMPORTANT

      // ===============================
      // 🔍 FIND OR CREATE USER
      // ===============================
      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        const referralCode = crypto
          .randomBytes(4)
          .toString("hex")
          .toUpperCase()

        user = await prisma.user.create({
          data: {
            email,
            referralCode,
          },
        })
      }

      // ===============================
      // 💳 UPDATE SUBSCRIPTION
      // ===============================
      if (session.subscription) {
        await prisma.user.update({
          where: { email },
          data: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: "active",
            plan: plan, // ✅ SAVE PLAN
          },
        })
      }

      // ===============================
      // 🧾 PREVENT DUPLICATE PURCHASE
      // ===============================
      const existingPurchase = await prisma.purchase.findUnique({
        where: { stripeSessionId: session.id },
      })

      if (!existingPurchase) {
        await prisma.purchase.create({
          data: {
            stripeSessionId: session.id,
            userId: user.id,
            referralUsed,
          },
        })

        try {
          await sendWelcomeEmail(email)
        } catch (err) {
          console.error("⚠️ Email failed:", err)
        }
      }

      // ===============================
      // 🎁 REFERRAL CREDIT
      // ===============================
      if (referralUsed) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode: referralUsed },
        })

        if (referrer) {
          await prisma.user.update({
            where: { id: referrer.id },
            data: {
              referralCredit: {
                increment: 30,
              },
            },
          })
        }
      }
    }

    // ===============================
    // 🔄 SUBSCRIPTION UPDATED
    // ===============================
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      })

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: subscription.status,
          },
        })
      }
    }

    // ===============================
    // ❌ SUBSCRIPTION CANCELLED
    // ===============================
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      })

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: "cancelled",
          },
        })
      }
    }

    // ===============================
    // ⚠️ PAYMENT FAILED
    // ===============================
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      })

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: "past_due",
          },
        })
      }
    }
  } catch (error) {
    console.error("❌ Webhook processing error:", error)
  }

  return NextResponse.json({ received: true })
}