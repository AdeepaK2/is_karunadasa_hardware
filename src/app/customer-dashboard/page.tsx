'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Package, ShoppingCart, User, CreditCard, Star, TrendingUp, Truck } from 'lucide-react';
import Image from 'next/image';
import { customerDemoOrders } from '@/lib/customerDemoData';

export default function CustomerDashboard() {
  const { currentUser, sales, products } = useApp();

  // Get customer's orders
  let customerOrders = sales.filter(sale =>
    sale.customerId === currentUser?.id
  );

  // If no orders found, use demo data
  if (customerOrders.length === 0) {
    customerOrders = customerDemoOrders;
  }

  // Calculate customer stats
  const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = customerOrders.length;
  const loyaltyPoints = currentUser ? (totalSpent * 0.01) : 0; // 1 point per Rs. 100 spent

  // Recent orders (last 5)
  const recentOrders = customerOrders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get previously bought products with images
  const previouslyBoughtProducts = customerOrders
    .flatMap(order => order.items.map(item => item.product))
    .filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    )
    .slice(0, 6); // Show first 6 unique products

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

      {/* Free Delivery Banner */}
      <div className="mb-8 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">
              Free Delivery on Orders Over LKR 5,000!
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              Shop now and enjoy free shipping on your order
            </p>
          </div>
        </div>
      </div>

      {/* Previously Bought Products */}
      {previouslyBoughtProducts.length > 0 && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Previously Purchased Items</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Items you've ordered before</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {previouslyBoughtProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-2">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</h3>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">LKR {product.sellingPrice.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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