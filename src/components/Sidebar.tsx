'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  UserCog,
  TrendingUp,
  Settings,
  Truck,
  Receipt,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Billing', icon: ShoppingCart, path: '/billing' },
  { name: 'Inventory', icon: Package, path: '/inventory' },
  { name: 'Customers', icon: Users, path: '/customers' },
  { name: 'Employees', icon: UserCog, path: '/employees' },
  { name: 'Sales History', icon: TrendingUp, path: '/sales' },
  { name: 'Suppliers', icon: Truck, path: '/suppliers' },
  { name: 'Expenses', icon: Receipt, path: '/expenses' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Hardware POS</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Point of Sale System</p>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
