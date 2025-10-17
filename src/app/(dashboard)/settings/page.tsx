'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Moon, Sun, Database, Download, Upload, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme, initializeData } = useApp();

  const handleExportData = () => {
    const data = {
      products: localStorage.getItem('pos_products'),
      customers: localStorage.getItem('pos_customers'),
      employees: localStorage.getItem('pos_employees'),
      sales: localStorage.getItem('pos_sales'),
      suppliers: localStorage.getItem('pos_suppliers'),
      expenses: localStorage.getItem('pos_expenses'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pos-backup-${new Date().toISOString()}.json`;
    a.click();
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data to defaults? This cannot be undone!')) {
      localStorage.clear();
      initializeData();
      alert('Data has been reset to defaults!');
      window.location.reload();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage application preferences and data
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'light' ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Theme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Toggle Theme
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Export Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Download all your data as JSON
                </p>
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export
            </button>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Storage Info</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Data is stored locally in your browser
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm">
              LocalStorage
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Reset Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Clear all data and reset to defaults
                </p>
              </div>
            </div>
            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Version</p>
            <p className="font-medium text-gray-900 dark:text-white">1.0.0</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Environment</p>
            <p className="font-medium text-gray-900 dark:text-white">Frontend Only</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Framework</p>
            <p className="font-medium text-gray-900 dark:text-white">Next.js 15</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Storage</p>
            <p className="font-medium text-gray-900 dark:text-white">Browser LocalStorage</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> This is a frontend-only demo application. All data is stored locally in your
          browser's LocalStorage. To integrate with a real backend, replace the storage layer with API calls.
        </p>
      </div>
    </div>
  );
}
