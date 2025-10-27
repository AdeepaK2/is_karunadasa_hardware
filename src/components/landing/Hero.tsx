'use client';

import Link from 'next/link';
import { ArrowRight, Wrench } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-amber-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Karunadasa Hardware
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Your neighborhood hardware store in Athurugiriya. Quality tools, building materials, 
            and everything you need for your construction and repair projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded transition-colors"
            >
              Visit Our Store
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="tel:0112887654"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded transition-colors"
            >
              Call: 011 288 7654
            </a>
          </div>

          {/* Simple illustration */}
          <div className="pt-12 flex justify-center">
            <div className="relative">
              <div className="bg-orange-600 p-8 rounded-lg inline-block">
                <Wrench className="w-32 h-32 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium">
                Serving Athurugiriya
              </div>
            </div>
          </div>

          {/* Simple stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-8 text-center">
            <div className="border-r border-gray-300 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">Wide Range</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">of Products</div>
            </div>
            <div className="border-r border-gray-300 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">Local</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Family Business</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">Fair</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Prices</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
