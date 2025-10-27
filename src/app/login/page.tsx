'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { User, Lock, LogIn } from 'lucide-react';
import { getPermissionsForRole, getDefaultRoute } from '@/lib/permissions';

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'manager' | 'cashier' | 'customer'>('customer');
  const [name, setName] = useState('');
  const { login, users, customers } = useApp();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    let user;

    if (role === 'customer') {
      // Find existing customer
      const customer = customers.find(c => c.email === name || c.phone === name);
      if (customer) {
        user = {
          id: customer.id,
          name: customer.name,
          email: customer.email || '',
          role: 'customer' as const,
          phone: customer.phone,
          createdAt: customer.createdAt,
          permissions: getPermissionsForRole('customer'),
        };
      } else {
        // Create demo customer if not found
        const demoCustomer = {
          id: Date.now().toString(),
          name: name || 'Demo Customer',
          phone: '011 288 7654',
          email: `${name || 'demo'}@customer.com`,
          address: 'Athurugiriya',
          outstandingBalance: 0,
          loyaltyPoints: 50,
          createdAt: new Date(),
        };
        user = {
          id: demoCustomer.id,
          name: demoCustomer.name,
          email: demoCustomer.email,
          role: 'customer' as const,
          phone: demoCustomer.phone,
          createdAt: demoCustomer.createdAt,
          permissions: getPermissionsForRole('customer'),
        };
      }
    } else {
      // Find existing staff user or create one
      user = users.find(u => u.role === role);

      if (!user) {
        user = {
          id: Date.now().toString(),
          name: name || `${role.charAt(0).toUpperCase()}${role.slice(1)} User`,
          email: `${role}@hardwarestore.com`,
          role: role,
          createdAt: new Date(),
          permissions: getPermissionsForRole(role),
        };
      }
    }

    login(user);
    const defaultRoute = getDefaultRoute(role);
    router.push(defaultRoute);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <LogIn className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hardware POS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Role
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="customer">Customer</option>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Demo Mode:</strong> This is a frontend-only system. No password required.
          </p>
        </div>

        {/* Quick Access */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
            Quick Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setRole('customer'); setName('Demo Customer'); }}
              className="text-xs py-2 px-3 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => { setRole('cashier'); setName('Cashier User'); }}
              className="text-xs py-2 px-3 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cashier
            </button>
            <button
              type="button"
              onClick={() => { setRole('manager'); setName('Manager User'); }}
              className="text-xs py-2 px-3 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => { setRole('admin'); setName('Admin User'); }}
              className="text-xs py-2 px-3 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
