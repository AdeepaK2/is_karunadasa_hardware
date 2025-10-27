'use client';

import { ShoppingCart, Package, TrendingUp, Users, BarChart3, Lock } from 'lucide-react';

const features = [
  {
    icon: ShoppingCart,
    title: 'Smart Billing System',
    description: 'Fast and efficient point-of-sale system with barcode scanning and quick search capabilities.',
    color: 'blue',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Real-time stock tracking, low stock alerts, and automated reorder notifications.',
    color: 'green',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Track customer history, loyalty points, and manage credit accounts efficiently.',
    color: 'purple',
  },
  {
    icon: TrendingUp,
    title: 'Sales Analytics',
    description: 'Comprehensive reports and insights to track your business performance.',
    color: 'orange',
  },
  {
    icon: BarChart3,
    title: 'Business Reports',
    description: 'Daily, weekly, and monthly reports with profit/loss analysis and trends.',
    color: 'pink',
  },
  {
    icon: Lock,
    title: 'Role-Based Access',
    description: 'Secure access control with different permission levels for staff members.',
    color: 'indigo',
  },
];

const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  green: { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', icon: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', icon: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
};

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to run a successful hardware store, all in one modern platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            
            return (
              <div
                key={index}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 border ${colors.border} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
