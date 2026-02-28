import Link from "next/link"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params?.session_id

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-gray-500">Invalid payment session.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-serif text-gray-900">
          ACCESS CONFIRMED
        </h1>

        <p className="text-gray-600">
          Finalizing your initiation...
        </p>

        <meta
          httpEquiv="refresh"
          content={`1;url=/api/auth/complete?session_id=${sessionId}`}
        />

        <Link
          href={`/api/auth/complete?session_id=${sessionId}`}
          className="inline-block px-8 py-3 bg-gray-900 text-white tracking-wide"
        >
          Continue
        </Link>
      </div>
    </main>
  )
}