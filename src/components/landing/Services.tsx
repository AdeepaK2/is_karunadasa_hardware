'use client';

import { Hammer, Truck, Phone, DollarSign } from 'lucide-react';

const services = [
  {
    icon: Hammer,
    title: 'Tools & Hardware',
    description: 'From hammers to power tools. We stock what you need to get the job done.',
  },
  {
    icon: Truck,
    title: 'Delivery Available',
    description: 'Can\'t pick it up? We\'ll bring it to you. Just give us a call.',
  },
  {
    icon: Phone,
    title: 'Need Help?',
    description: 'Not sure what you need? Our staff actually knows their stuff. Come ask us.',
  },
  {
    icon: DollarSign,
    title: 'Fair Prices',
    description: 'No games, no hidden fees. Just honest prices for good products.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Why Shop With Us?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We keep it simple
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg"
              >
                <Icon className="w-12 h-12 text-orange-600 dark:text-orange-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-orange-600 dark:bg-orange-700 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Visit Our Store Today
          </h3>
          <p className="text-orange-100 mb-6">
            Come see what we have. Bring your project questions.
          </p>
          <a
            href="tel:+94123456789"
            className="inline-block px-6 py-3 bg-white text-orange-600 font-bold rounded hover:bg-gray-100 transition-colors"
          >
            Call: +94 123 456 789
          </a>
        </div>
      </div>
    </section>
  );
}
