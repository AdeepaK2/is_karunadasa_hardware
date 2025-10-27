'use client';

import { ShoppingCart, Package, Users, TrendingUp, Wrench, Shield } from 'lucide-react';

const features = [
  {
    icon: ShoppingCart,
    title: 'Fast Checkout',
    description: 'Quick billing with barcode scanning. Get customers in and out fast.',
  },
  {
    icon: Package,
    title: 'Track Your Stock',
    description: 'Know what you have and what you need. Low stock alerts keep you prepared.',
  },
  {
    icon: Users,
    title: 'Know Your Customers',
    description: 'Keep track of regulars, credit accounts, and purchase history.',
  },
  {
    icon: TrendingUp,
    title: 'Sales Reports',
    description: 'See what\'s selling, what\'s not, and where your money is going.',
  },
  {
    icon: Wrench,
    title: 'Easy to Use',
    description: 'No tech degree needed. Train your staff in minutes, not days.',
  },
  {
    icon: Shield,
    title: 'Secure Access',
    description: 'Different access levels for managers, cashiers, and staff.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            What You Get
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything a hardware store needs in one system
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
