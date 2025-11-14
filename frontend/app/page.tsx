"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Database, TrendingUp, Cpu, ArrowRight } from "lucide-react";

export default function Home() {
  const stats = [
    { label: "Total Records", value: "206K+", icon: Database },
    { label: "Response Time", value: "<100ms", icon: Zap },
    { label: "API Endpoints", value: "4", icon: TrendingUp },
    { label: "Real-time Search", value: "Enabled", icon: Cpu },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Sub-100ms response times with Redis caching and optimized queries",
    },
    {
      icon: Database,
      title: "100K+ Records",
      description:
        "Handle massive datasets with virtual scrolling and pagination",
    },
    {
      icon: TrendingUp,
      title: "Smart Filtering",
      description:
        "Real-time search, sorting, and advanced filtering capabilities",
    },
    {
      icon: Cpu,
      title: "Modern Stack",
      description:
        "Next.js 16, FastAPI, PostgreSQL, and Docker for production-ready deployment",
    },
  ];

  const tables = [
    {
      name: "Products",
      emoji: "📦",
      count: "1,000+",
      description: "Browse products with prices, categories, and inventory",
      href: "/products",
    },
    {
      name: "Users",
      emoji: "👥",
      count: "5,000+",
      description: "Explore users with locations and lifetime value metrics",
      href: "/users",
    },
    {
      name: "Orders",
      emoji: "🛒",
      count: "100,000+",
      description: "View massive order dataset with status and pricing data",
      href: "/orders",
    },
    {
      name: "Transactions",
      emoji: "💳",
      count: "100,000+",
      description: "Analyze transactions with payment methods and status",
      href: "/transactions",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
            ✨ Next Generation Data Tables
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-blue-600">Lightning-Fast</span>
              <br className="hidden sm:block" />
              <span className="text-gray-900">Data Browsing</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience blazing-fast performance with 100K+ records. Built with
              modern technologies for the next generation of web applications.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg"
            >
              <Link
                href="/products"
                className="flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <button className="bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors">
              Learn More
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <Icon className="w-5 h-5 sm:w-6 h-6 text-blue-600 mx-auto mb-2 sm:mb-3" />
                  <div className="text-xs sm:text-sm text-gray-600">
                    {stat.label}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Powerful Features
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need for high-performance data management
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-gray-50 p-6 sm:p-8 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 sm:w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 sm:w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Tables Section */}
      <section className="px-4 py-12 md:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Browse Your Data
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Choose a table to explore 100K+ records with powerful filtering
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {tables.map((table, i) => (
              <Link key={i} href={table.href}>
                <div className="group h-full bg-white p-6 sm:p-8 rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
                  <div className="space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="text-5xl sm:text-6xl mb-4">
                        {table.emoji}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        {table.name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm sm:text-base">
                        {table.count} records
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm sm:text-base mb-4">
                        {table.description}
                      </p>
                      <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                        View Table
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
