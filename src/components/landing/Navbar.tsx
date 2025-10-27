'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/hw_logo.png"
              alt="Karunadasa Hardware Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Karunadasa Hardware
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium">
              Features
            </a>
            <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium">
              Services
            </a>
            <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium">
              About
            </a>
            <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium">
              Contact
            </a>
            <Link
              href="/register"
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors mr-2"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-3">
              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium"
              >
                Features
              </a>
              <a
                href="#services"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium"
              >
                Services
              </a>
              <a
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium"
              >
                Contact
              </a>
              <Link
                href="/register"
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded text-center transition-colors"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded text-center transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
