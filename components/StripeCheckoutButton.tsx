"use client"

export default function StripeCheckoutButton() {

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
      className="px-8 py-3 bg-gray-900 text-white text-sm tracking-widest uppercase hover:opacity-90 transition"
    >
      Initiate Access
    </button>
  )
}