'use client';

import { Store } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About Us
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We're a local hardware store that's been around for a while. We sell tools, 
                building materials, and pretty much everything you need for construction and repairs.
              </p>
              <p>
                Our staff knows hardware. They can actually help you figure out what you need 
                instead of just pointing at aisles. We've helped everyone from weekend DIYers 
                to professional contractors.
              </p>
              <p>
                We keep our prices fair, our stock well-maintained, and our service straightforward. 
                No gimmicks, no nonsense.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-500">5+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years in Business</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-500">Local</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Family Owned</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-12 flex items-center justify-center">
            <div className="text-center">
              <Store className="w-32 h-32 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 italic">
                "Quality products, honest service"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
