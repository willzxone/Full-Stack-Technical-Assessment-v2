"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 rounded-lg border border-gray-200 bg-white p-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          📊 High-Performance Data Table
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Experience lightning-fast data browsing with 100k+ records. Built with
          Next.js, FastAPI, PostgreSQL, and Redis for optimal performance.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/products">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              View Source Code
            </a>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-3 text-xl font-bold text-gray-900">⚡ Performance</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Response time under 100ms</li>
            <li>✓ Virtual scrolling support</li>
            <li>✓ Redis caching enabled</li>
            <li>✓ Database indexes optimized</li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-3 text-xl font-bold text-gray-900">
            🔍 Smart Filtering
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Real-time search</li>
            <li>✓ Advanced sorting</li>
            <li>✓ Client-side filtering</li>
            <li>✓ Multiple columns support</li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-3 text-xl font-bold text-gray-900">
            🎨 Modern UI
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Responsive design</li>
            <li>✓ Tailwind CSS styled</li>
            <li>✓ Loading states</li>
            <li>✓ Error handling</li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-3 text-xl font-bold text-gray-900">
            🏗️ Tech Stack
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Next.js 16 with TypeScript</li>
            <li>✓ FastAPI backend</li>
            <li>✓ PostgreSQL database</li>
            <li>✓ Docker Compose setup</li>
          </ul>
        </div>
      </section>

      {/* Data Tables */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Browse Tables</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/products">
            <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-8 transition hover:border-blue-400 hover:shadow-lg">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                Products 📦
              </h3>
              <p className="text-gray-600">
                Browse 1,000+ products with price, category, and inventory information
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                View Table →
              </div>
            </div>
          </Link>

          <Link href="/users">
            <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-8 transition hover:border-blue-400 hover:shadow-lg">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                Users 👥
              </h3>
              <p className="text-gray-600">
                Explore 5,000+ users with location, signup date, and lifetime value
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                View Table →
              </div>
            </div>
          </Link>

          <Link href="/orders">
            <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-8 transition hover:border-blue-400 hover:shadow-lg">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                Orders 🛒
              </h3>
              <p className="text-gray-600">
                View 100,000+ orders with status, customer, product, and pricing data
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                View Table →
              </div>
            </div>
          </Link>

          <Link href="/transactions">
            <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-8 transition hover:border-blue-400 hover:shadow-lg">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                Transactions 💳
              </h3>
              <p className="text-gray-600">
                Analyze 100,000+ transactions with payment method, status, and amounts
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                View Table →
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
