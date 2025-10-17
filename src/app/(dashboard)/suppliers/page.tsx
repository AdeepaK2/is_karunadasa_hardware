'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';

export default function SuppliersPage() {
  const { suppliers } = useApp();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supplier Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your suppliers and vendor relationships
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Supplier management coming soon...</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Currently showing {suppliers.length} suppliers in system
        </p>
      </div>
    </div>
  );
}
