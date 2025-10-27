'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Store,
  Package,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/customer-dashboard', icon: Home },
  { name: 'Products', href: '/customer-dashboard/products', icon: ShoppingBag },
  { name: 'Cart', href: '/customer-dashboard/cart', icon: ShoppingCart },
  { name: 'Orders', href: '/customer-dashboard/orders', icon: Package },
  { name: 'Profile', href: '/customer-dashboard/profile', icon: User },
];

export default function CustomerSidebar() {
  const { currentUser, logout } = useApp();
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <img
            src="/hw_logo.png"
            alt="Karunadasa Hardware Logo"
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Karunadasa
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Customer Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">
              {currentUser?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {currentUser?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Customer
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}