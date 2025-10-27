'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  Package,
  Calendar,
  CreditCard,
  Eye,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';

export default function OrdersPage() {
  const { currentUser, sales, customers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Find customer data
  const customerData = customers.find(c =>
    c.name === currentUser?.name || c.phone === currentUser?.phone
  );

  // Get customer's orders
  const customerOrders = sales
    .filter(sale =>
      sale.customerName?.toLowerCase() === currentUser?.name?.toLowerCase() ||
      sale.customerId === currentUser?.id ||
      sale.customerId === customerData?.id
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter orders based on search and status
  const filteredOrders = customerOrders.filter(order => {
    const matchesSearch = searchTerm === '' ||
      order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item =>
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPaymentModeIcon = (mode: string) => {
    switch (mode) {
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'upi':
        return '📱';
      case 'credit':
        return '💰';
      default:
        return '💳';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and track all your past orders.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by invoice number or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t placed any orders yet.'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {order.invoiceNumber}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(order.date), 'MMM dd, yyyy hh:mm a')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CreditCard className="w-4 h-4" />
                    <span>{getPaymentModeIcon(order.paymentMode)}</span>
                    {order.paymentMode.charAt(0).toUpperCase() + order.paymentMode.slice(1)}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.imageUrl || '/products/placeholder.png'}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/products/placeholder.png';
                        }}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          SKU: {item.product.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        ₹{item.product.sellingPrice.toLocaleString()} × {item.quantity}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        -₹{item.discount.toLocaleString()} discount
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-6 mb-4 sm:mb-0">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ₹{order.subtotal.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tax</span>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ₹{order.tax.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                    <div className="font-bold text-lg text-orange-600 dark:text-orange-400">
                      ₹{order.total.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {customerOrders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {customerOrders.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {customerOrders.filter(o => o.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{customerOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ₹{Math.round(customerOrders.reduce((sum, order) => sum + order.total, 0) / customerOrders.length).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}