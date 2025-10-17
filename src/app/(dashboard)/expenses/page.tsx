'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';

export default function ExpensesPage() {
  const { expenses } = useApp();

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track and manage business expenses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            ₹{totalExpenses.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Expense tracking interface coming soon...</p>
      </div>
    </div>
  );
}
