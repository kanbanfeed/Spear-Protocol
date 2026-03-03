"use client"

export default function StripeCheckoutButton({
  label = "SECURE PRIVATE ACCESS",
}: {
  label?: string
}) {
  async function handleCheckout() {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="
        inline-block
        px-10 py-4
        bg-[#121212]
        text-white
        text-[13px]
        tracking-[0.1em]
        uppercase
        font-medium
        border border-[#121212]
        hover:bg-white
        hover:text-[#121212]
        transition-opacity duration-200
      "
    >
      {label}
    </button>
  )
}