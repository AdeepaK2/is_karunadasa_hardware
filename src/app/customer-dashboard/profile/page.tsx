'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Edit3,
  Save,
  X,
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, sales, customers } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Find customer data
  const customerData = customers.find(c =>
    c.name === currentUser?.name || c.phone === currentUser?.phone
  );

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: customerData?.address || '',
  });

  // Calculate customer stats
  const customerOrders = sales.filter(sale =>
    sale.customerName?.toLowerCase() === currentUser?.name?.toLowerCase() ||
    sale.customerId === currentUser?.id
  );

  const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = customerOrders.length;
  const loyaltyPoints = customerData?.loyaltyPoints || 0;

  const handleSave = () => {
    // In a real app, this would update the user profile
    // For now, we'll just close the edit mode
    setIsEditing(false);
    // You could dispatch an action to update the user here
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: customerData?.address || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account information and view your activity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{currentUser?.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {currentUser?.email || 'Not provided'}
                    </span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{currentUser?.phone}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-900 dark:text-white">
                      {customerData?.address || 'Not provided'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Account Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {totalOrders}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{totalSpent.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {loyaltyPoints}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Loyalty Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.floor(totalSpent / 100)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Points Earned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Program & Quick Actions */}
        <div className="space-y-6">
          {/* Loyalty Status */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Loyalty Program
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Points</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {loyaltyPoints}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${Math.min((loyaltyPoints / 500) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Earn 1 point for every ₹100 spent
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Order History</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">View past orders</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Wishlist</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Saved items</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Support</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Get help</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}