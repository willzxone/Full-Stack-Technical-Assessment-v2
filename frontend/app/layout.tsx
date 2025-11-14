import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import MobileMenu from "@/components/mobile-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataTable Pro - High Performance",
  description: "High-performance data table with 100k+ records",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
                    <span className="text-lg font-bold text-white">⚡</span>
                  </div>
                  <span className="hidden sm:inline text-lg sm:text-xl font-bold text-gray-900">
                    DataTable Pro
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex gap-6 lg:gap-8 text-sm lg:text-base">
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/users"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/transactions"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Transactions
                    </Link>
                  </li>
                </ul>

                {/* Mobile Menu */}
                <MobileMenu />
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white py-6 sm:py-8 mt-12 sm:mt-16">
            <div className="mx-auto max-w-7xl px-4 text-center text-xs sm:text-sm text-gray-600 sm:px-6 lg:px-8 space-y-2">
              <p>
                DataTable Pro • High-performance data table with 100k+ records
              </p>
              <p className="text-gray-500">FastAPI + PostgreSQL + Redis</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
