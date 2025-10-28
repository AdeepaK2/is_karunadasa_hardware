'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Package, ShoppingCart, User, CreditCard, Star, TrendingUp } from 'lucide-react';

export default function CustomerDashboard() {
  const { currentUser, sales, products } = useApp();

  // Get customer's orders
  const customerOrders = sales.filter(sale =>
    sale.customerId === currentUser?.id
  );

  // Calculate customer stats
  const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = customerOrders.length;
  const loyaltyPoints = currentUser ? (totalSpent * 0.01) : 0; // 1 point per Rs. 100 spent

  // Recent orders (last 5)
  const recentOrders = customerOrders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {currentUser?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your account overview and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">LKR {totalSpent.toFixed(2)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Loyalty Points</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(loyaltyPoints)}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Order #{order.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        LKR {order.total.toFixed(2)}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Your order history will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => window.location.href = '/inventory'}
                className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
              >
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Browse Products</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View available items</p>
                </div>
              </button>

              <button
                onClick={() => window.location.href = '/billing'}
                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Place Order</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start shopping now</p>
                </div>
              </button>

              <button
                onClick={() => window.location.href = '/customers'}
                className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
              >
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">My Profile</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Update your information</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}