'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/contexts/AppContext';
import {
  Package,
  Calendar,
  CreditCard,
  Eye,
  Download,
  Search,
  Filter,
  ShoppingBag,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { Sale } from '@/types';
import { customerDemoOrders } from '@/lib/customerDemoData';

export default function OrdersPage() {
  const { currentUser, sales, customers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Sale | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Find customer data
  const customerData = customers.find(c =>
    c.name === currentUser?.name || c.phone === currentUser?.phone
  );

  // Get customer's orders
  let customerOrders = sales
    .filter(sale =>
      sale.customerName?.toLowerCase() === currentUser?.name?.toLowerCase() ||
      sale.customerId === currentUser?.id ||
      sale.customerId === customerData?.id
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // If no personal orders found, use shared demo data
  if (customerOrders.length === 0) {
    customerOrders = customerDemoOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

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

  // View order details
  const handleViewDetails = (order: Sale) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Download invoice
  const handleDownloadInvoice = (order: Sale) => {
    const invoiceContent = `
KARUNADASA HARDWARE STORE
=====================================
Invoice: ${order.invoiceNumber}
Date: ${format(new Date(order.date), 'PPP')}
Customer: ${order.customerName}

=====================================
ITEMS:
${order.items.map((item, index) => `
${index + 1}. ${item.product.name}
   SKU: ${item.product.sku}
   Qty: ${item.quantity} x LKR ${item.product.sellingPrice.toLocaleString()}
   Subtotal: LKR ${(item.quantity * item.product.sellingPrice).toLocaleString()}
`).join('')}
=====================================
Subtotal: LKR ${order.subtotal.toLocaleString()}
Discount: LKR ${order.discount.toLocaleString()}
Delivery: ${order.subtotal >= 5000 ? 'FREE' : 'LKR 500'}
-------------------------------------
TOTAL: LKR ${order.total.toLocaleString()}
=====================================
Payment Mode: ${order.paymentMode.toUpperCase()}
Status: ${order.status.toUpperCase()}

Thank you for shopping with us!
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t placed any orders yet. Start shopping to see your order history here!'}
            </p>
            <Link
              href="/customer-dashboard/products"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
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
                        LKR {item.product.sellingPrice.toLocaleString()} × {item.quantity}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        -LKR {item.discount.toLocaleString()} discount
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
                      LKR {order.subtotal.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Delivery</span>
                    <div className={`font-semibold ${order.subtotal >= 5000 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                      {order.subtotal >= 5000 ? 'FREE' : 'LKR 500'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                    <div className="font-bold text-lg text-orange-600 dark:text-orange-400">
                      LKR {order.total.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewDetails(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDownloadInvoice(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order Details
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedOrder.invoiceNumber}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {format(new Date(selectedOrder.date), 'PPP p')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {getPaymentModeIcon(selectedOrder.paymentMode)} {selectedOrder.paymentMode.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedOrder.customerName}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="relative w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          SKU: {item.product.sku} | Brand: {item.product.brand}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          LKR {item.product.sellingPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                          LKR {(item.product.sellingPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">LKR {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Discount</span>
                      <span className="text-green-600 dark:text-green-400">-LKR {selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                    <span className={selectedOrder.subtotal >= 5000 ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-900 dark:text-white'}>
                      {selectedOrder.subtotal >= 5000 ? 'FREE' : 'LKR 500'}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-orange-600 dark:text-orange-400">LKR {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Download Invoice
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                LKR {customerOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                LKR {Math.round(customerOrders.reduce((sum, order) => sum + order.total, 0) / customerOrders.length).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}