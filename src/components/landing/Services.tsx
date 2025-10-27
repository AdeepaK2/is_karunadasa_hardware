'use client';

import { Wrench, Truck, Headphones, Award } from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'Quality Hardware',
    description: 'Wide range of premium tools, fasteners, and building materials from trusted brands.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable delivery service for all your hardware needs, right to your doorstep.',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Our knowledgeable staff is always ready to help you find the right products and solutions.',
  },
  {
    icon: Award,
    title: 'Best Prices',
    description: 'Competitive pricing with regular discounts and special offers for loyal customers.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive solutions for all your hardware and building material requirements
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <div
                key={index}
                className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="#contact"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Contact Us Today
            </a>
            <span className="text-gray-600 dark:text-gray-400">or</span>
            <a
              href="tel:+1234567890"
              className="px-8 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium text-lg transition-colors border border-gray-200 dark:border-gray-600"
            >
              Call: +123 456 7890
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
