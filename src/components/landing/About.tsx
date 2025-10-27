'use client';

import { Store, Target, Users as UsersIcon, Heart } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              About Karunadasa Hardware
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Karunadasa Hardware has been a cornerstone of our community, providing quality hardware 
              products and exceptional service. We pride ourselves on being more than just a store – 
              we're your trusted partner in building and creating.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Our commitment to excellence, competitive pricing, and customer satisfaction has made 
              us the go-to destination for contractors, builders, and DIY enthusiasts alike.
            </p>

            {/* Values */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Quality Products</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top brands and materials</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Expert Service</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Knowledgeable staff</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Community Focus</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Local & trusted</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Customer Care</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your satisfaction first</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Store className="w-32 h-32 text-blue-600 dark:text-blue-400 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Building Trust, One Project at a Time
                </h3>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-500 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
