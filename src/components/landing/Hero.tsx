'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero_section.png"
          alt="Karunadasa Hardware - Your Trusted Hardware Store in Athurugiriya"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-6 text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Karunadasa Hardware
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto drop-shadow-md">
            Your neighborhood hardware store in Athurugiriya. Quality tools, building materials,
            and everything you need for your construction and repair projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded transition-colors shadow-lg"
            >
              Visit Our Store
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="tel:0112887654"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded transition-colors shadow-lg"
            >
              Call: 011 288 7654
            </a>
          </div>

          {/* Stats overlay */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-12 text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border-r border-white border-opacity-30">
              <div className="text-2xl font-bold">Wide Range</div>
              <div className="text-sm opacity-90">of Products</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border-r border-white border-opacity-30">
              <div className="text-2xl font-bold">Local</div>
              <div className="text-sm opacity-90">Family Business</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">Fair</div>
              <div className="text-sm opacity-90">Prices</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
