import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function POST(req: Request) {
  const formData = await req.formData()
  const email = formData.get("email") as string

  if (!email) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    redirect("/")
  }

  const cookieStore = await cookies()
  cookieStore.set("user_email", email, {
    httpOnly: true,
    path: "/",
  })

  redirect("/dashboard")
}