'use client';

import Link from 'next/link';
import { Store, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-6 h-6 text-orange-500" />
              <span className="text-lg font-bold text-white">
                Karunadasa Hardware
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your local hardware store. Quality products, honest service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-orange-500 transition-colors">Features</a>
              </li>
              <li>
                <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
              </li>
              <li>
                <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
              </li>
              <li>
                <Link href="/login" className="hover:text-orange-500 transition-colors">Staff Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>8711/C Athurugiriya, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>011 288 7654</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>info@karunadasahardware.lk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Karunadasa Hardware. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
