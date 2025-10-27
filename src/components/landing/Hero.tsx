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
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-6 text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-2xl text-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 4px 4px 8px rgba(0,0,0,0.6)'}}>
            Karunadasa Hardware
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto drop-shadow-xl" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8), 2px 2px 6px rgba(0,0,0,0.6)'}}>
            Your neighborhood hardware store in Athurugiriya. Quality tools, building materials,
            and everything you need for your construction and repair projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded transition-colors shadow-2xl border-2 border-orange-400"
              style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)', boxShadow: '0 4px 15px rgba(0,0,0,0.3), 0 2px 8px rgba(255,165,0,0.2)'}}
            >
              Visit Our Store
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded transition-colors shadow-2xl border-2 border-gray-300"
              style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'}}
            >
              Join as Customer
            </a>
            <a
              href="tel:0112887654"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded transition-colors shadow-2xl border-2 border-gray-600"
              style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)', boxShadow: '0 4px 15px rgba(0,0,0,0.4)'}}
            >
              Call: 011 288 7654
            </a>
          </div>

          {/* Stats overlay */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-12 text-center">
            <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-20 shadow-2xl">
              <div className="text-2xl font-bold text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>Wide Range</div>
              <div className="text-sm text-gray-200 opacity-90" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>of Products</div>
            </div>
            <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-20 shadow-2xl">
              <div className="text-2xl font-bold text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>Local</div>
              <div className="text-sm text-gray-200 opacity-90" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>Family Business</div>
            </div>
            <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-20 shadow-2xl">
              <div className="text-2xl font-bold text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>Fair</div>
              <div className="text-sm text-gray-200 opacity-90" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>Prices</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
