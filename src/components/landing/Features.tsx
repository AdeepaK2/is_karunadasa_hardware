'use client';

import { Wrench, Package, Truck, Shield, Clock, DollarSign } from 'lucide-react';

const features = [
  {
    icon: Wrench,
    title: 'Quality Tools',
    description: 'Hand tools, power tools, and everything in between from trusted brands.',
  },
  {
    icon: Package,
    title: 'Building Materials',
    description: 'Cement, sand, bricks, timber, and all construction materials you need.',
  },
  {
    icon: Truck,
    title: 'Delivery Service',
    description: 'Can\'t carry it yourself? We deliver to your site or home.',
  },
  {
    icon: Clock,
    title: 'Open 6 Days',
    description: 'Monday to Saturday, we\'re here when you need us.',
  },
  {
    icon: Shield,
    title: 'Genuine Products',
    description: 'All our products are authentic with proper warranties.',
  },
  {
    icon: DollarSign,
    title: 'Competitive Prices',
    description: 'Fair pricing with special rates for contractors and bulk orders.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need for your building and repair projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
              >
                <Icon className="w-10 h-10 text-orange-600 dark:text-orange-500 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
