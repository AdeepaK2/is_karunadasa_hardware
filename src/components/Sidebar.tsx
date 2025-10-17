'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
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
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', permission: 'canViewDashboard' as const },
  { name: 'Billing', icon: ShoppingCart, path: '/billing', permission: 'canManageBilling' as const },
  { name: 'Inventory', icon: Package, path: '/inventory', permission: 'canViewInventory' as const },
  { name: 'Customers', icon: Users, path: '/customers', permission: 'canManageCustomers' as const },
  { name: 'Employees', icon: UserCog, path: '/employees', permission: 'canManageEmployees' as const },
  { name: 'Sales History', icon: TrendingUp, path: '/sales', permission: 'canViewSales' as const },
  { name: 'Suppliers', icon: Truck, path: '/suppliers', permission: 'canManageSuppliers' as const },
  { name: 'Expenses', icon: Receipt, path: '/expenses', permission: 'canManageExpenses' as const },
  { name: 'Settings', icon: Settings, path: '/settings', permission: 'canAccessSettings' as const },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useApp();

  if (!currentUser || !currentUser.permissions) return null;

  // Filter menu items based on user permissions
  const accessibleMenuItems = menuItems.filter((item) => {
    return currentUser.permissions?.[item.permission] === true;
  });

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Hardware POS</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Portal
        </p>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {accessibleMenuItems.map((item) => {
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

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
