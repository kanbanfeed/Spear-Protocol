"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ReferralPage({
  params,
}: {
  params: { slug: string }
}) {
  const router = useRouter()

  useEffect(() => {
    if (params.slug) {
      // store referral (username OR referralCode)
      localStorage.setItem("referralCode", params.slug)
    }

    // redirect to homepage or dashboard
    router.push("/")
  }, [params.slug])

  return null
}