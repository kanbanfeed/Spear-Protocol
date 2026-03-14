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
    console.error("Webhook Error: Missing Stripe signature")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("Stripe webhook received:", event.type)

  try {

    // ===============================
    // CHECKOUT COMPLETED
    // ===============================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

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
        console.error("Webhook Error: Email not found in session")
        return NextResponse.json({ received: true })
      }

      const referralUsed = session.metadata?.ref || null

      // Find or create user
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

      // Save subscription info
      if (session.subscription) {
        await prisma.user.update({
          where: { email },
          data: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: "active",
          },
        })
      }

      // Prevent duplicate purchase
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
          console.error("Welcome email failed:", err)
        }
      }

      // Referral credit
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
    // SUBSCRIPTION UPDATED
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
    // SUBSCRIPTION CANCELLED
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
    // PAYMENT FAILED
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
    console.error("Webhook processing error:", error)
  }

  return NextResponse.json({ received: true })
}