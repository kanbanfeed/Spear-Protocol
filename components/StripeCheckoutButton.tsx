"use client"

export default function StripeCheckoutButton({
  label = "SECURE PRIVATE ACCESS",
  email,
}: {
  label?: string
  email: string
}) {

  async function handleCheckout() {
    if (!email) {
      alert("Please enter your email")
      return
    }

    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
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
        group relative w-full overflow-hidden 
        bg-gradient-to-r from-amber-500 to-amber-600 
        text-black font-bold py-4 px-8 rounded-xl text-lg 
        transition-all duration-300 hover:scale-[1.02] 
        hover:shadow-2xl hover:shadow-amber-500/30 
        active:scale-[0.98]
      "
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {label}
        <svg 
          className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 7l5 5m0 0l-5 5m5-5H6" 
          />
        </svg>
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  )
}