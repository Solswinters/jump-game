/**
 * 404 Not Found page
 */

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-purple-500">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="mb-8 text-gray-400">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-purple-500 px-6 py-3 text-white transition-colors hover:bg-purple-600"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
