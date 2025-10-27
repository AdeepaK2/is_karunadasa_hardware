'use client';

import Link from 'next/link';
import { Store, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Karunadasa Hardware
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for quality hardware, tools, and building materials.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-400 transition-colors">Services</a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Products</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">Hand Tools</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">Power Tools</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">Building Materials</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">Electrical</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">Plumbing</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 Hardware Street, Building District, City 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">+94 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">info@karunadasahardware.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Karunadasa Hardware. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
