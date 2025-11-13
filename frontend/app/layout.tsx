import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Table - High Performance",
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
          <nav className="border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  📊 DataTable
                </Link>
                <ul className="flex gap-6">
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-700 hover:text-blue-600"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/users"
                      className="text-gray-700 hover:text-blue-600"
                    >
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      className="text-gray-700 hover:text-blue-600"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/transactions"
                      className="text-gray-700 hover:text-blue-600"
                    >
                      Transactions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white py-8">
            <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8">
              <p>
                High-performance data table with 100k+ records • FastAPI +
                PostgreSQL + Redis
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
