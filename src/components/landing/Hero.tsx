'use client';

import Link from 'next/link';
import { ArrowRight, Hammer, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              Modern Hardware Store Solution
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Welcome to
              <span className="block text-blue-600 dark:text-blue-400">
                Karunadasa Hardware
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Your trusted partner for quality hardware, tools, and building materials. 
              Serving the community with excellence since day one.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium text-lg transition-colors border border-gray-200 dark:border-gray-700"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image/Illustration */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 shadow-2xl">
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Hammer className="w-48 h-48 text-white opacity-80" />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Sales</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">₹50,000+</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Inventory Items</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
