import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const email = formData.get("email") as string

    if (!email) {
      console.warn("Verify attempt without email")
      redirect("/")
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.warn("Verify attempt for non-existing user:", email)
      redirect("/")
    }

    // Optional: block users with cancelled subscription
    if (user.subscriptionStatus && user.subscriptionStatus !== "active") {
      console.warn("User with inactive subscription tried login:", email)
      redirect("/subscribe")
    }

    const cookieStore = await cookies()

    cookieStore.set("user_email", email, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("User verified and cookie set:", email)

    redirect("/dashboard")
  } catch (error) {
    console.error("VERIFY ERROR:", error)
    redirect("/")
  }
}