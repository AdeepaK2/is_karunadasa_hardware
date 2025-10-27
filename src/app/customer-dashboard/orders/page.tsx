'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  let customerOrders = sales
    .filter(sale =>
      sale.customerName?.toLowerCase() === currentUser?.name?.toLowerCase() ||
      sale.customerId === currentUser?.id ||
      sale.customerId === customerData?.id
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // If no personal orders found, show demo orders for demonstration
  if (customerOrders.length === 0) {
    // Create demo orders directly for demonstration
    const demoOrders = [
      {
        id: "demo-1",
        invoiceNumber: "INV-2025-9001",
        customerId: "demo-customer",
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "1",
              name: "Hammer",
              sku: "HW-001",
              category: "Hand Tools",
              brand: "Stanley",
              purchasePrice: 150,
              sellingPrice: 250,
              quantity: 45,
              reorderLevel: 10,
              supplier: 'Tools Wholesale',
              barcode: '1234567890123',
              description: 'Professional claw hammer',
              imageUrl: '/products/8.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 2,
            discount: 50,
          },
          {
            product: {
              id: "2",
              name: "Screwdriver Set",
              sku: "HW-002", 
              category: "Hand Tools",
              brand: "Bosch",
              purchasePrice: 300,
              sellingPrice: 450,
              quantity: 30,
              reorderLevel: 15,
              supplier: 'Tools Wholesale',
              barcode: '1234567890124',
              description: 'Complete screwdriver set',
              imageUrl: '/products/7.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 1,
            discount: 0,
          },
        ],
        subtotal: 950,
        discount: 50,
        tax: 135,
        total: 1035,
        paymentMode: "cash" as const,
        cashierId: "3",
        cashierName: "Dilini Cashier",
        date: new Date("2025-10-25T14:30:00"),
        status: "completed" as const,
      },
      {
        id: "demo-2", 
        invoiceNumber: "INV-2025-9002",
        customerId: "demo-customer",
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "5",
              name: "LED Bulb 9W",
              sku: "EL-001",
              category: "Electrical",
              brand: "Philips",
              purchasePrice: 80,
              sellingPrice: 120,
              quantity: 200,
              reorderLevel: 50,
              supplier: 'Electrical Depot',
              barcode: '1234567890127',
              description: 'Energy efficient LED bulb',
              imageUrl: '/products/4.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 6,
            discount: 0,
          },
        ],
        subtotal: 720,
        discount: 0,
        tax: 108,
        total: 828,
        paymentMode: "card" as const,
        cashierId: "4", 
        cashierName: "Rohan Cashier",
        date: new Date("2025-10-22T11:15:00"),
        status: "completed" as const,
      },
      {
        id: "demo-3",
        invoiceNumber: "INV-2025-9003", 
        customerId: "demo-customer",
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "3",
              name: "Electric Drill",
              sku: "PW-001",
              category: "Power Tools", 
              brand: "DeWalt",
              purchasePrice: 3500,
              sellingPrice: 5200,
              quantity: 8,
              reorderLevel: 5,
              supplier: 'Power Tools Inc',
              barcode: '1234567890125',
              description: 'Cordless electric drill',
              imageUrl: '/products/6.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 1,
            discount: 500,
          },
        ],
        subtotal: 5200,
        discount: 500,
        tax: 705,
        total: 5405,
        paymentMode: "upi" as const,
        cashierId: "3",
        cashierName: "Dilini Cashier", 
        date: new Date("2025-10-18T09:45:00"),
        status: "completed" as const,
      },
      {
        id: "demo-4",
        invoiceNumber: "INV-2025-9004",
        customerId: "demo-customer", 
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "4",
              name: 'Paint Brush 2"',
              sku: "PT-001",
              category: "Painting",
              brand: "Asian Paints",
              purchasePrice: 50,
              sellingPrice: 85,
              quantity: 120,
              reorderLevel: 30,
              supplier: 'Paint Supplies Co',
              barcode: '1234567890126',
              description: 'Professional paint brush',
              imageUrl: '/products/5.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 4,
            discount: 20,
          },
          {
            product: {
              id: "7",
              name: "Measuring Tape 5M",
              sku: "HW-003",
              category: "Hand Tools",
              brand: "Stanley", 
              purchasePrice: 100,
              sellingPrice: 160,
              quantity: 55,
              reorderLevel: 20,
              supplier: 'Tools Wholesale',
              barcode: '1234567890129',
              description: 'Professional measuring tape',
              imageUrl: '/products/2.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 2,
            discount: 0,
          },
        ],
        subtotal: 660,
        discount: 20,
        tax: 96,
        total: 736,
        paymentMode: "cash" as const,
        cashierId: "5",
        cashierName: "Sanduni Perera",
        date: new Date("2025-10-15T16:20:00"),
        status: "completed" as const,
      },
      {
        id: "demo-5",
        invoiceNumber: "INV-2025-9005",
        customerId: "demo-customer",
        customerName: "Demo Customer", 
        items: [
          {
            product: {
              id: "8",
              name: "Safety Goggles",
              sku: "SF-001",
              category: "Safety",
              brand: "3M",
              purchasePrice: 150,
              sellingPrice: 250,
              quantity: 40,
              reorderLevel: 15,
              supplier: 'Safety Equipment Co',
              barcode: '1234567890130',
              description: 'Anti-fog safety goggles',
              imageUrl: '/products/1.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 2,
            discount: 0,
          },
        ],
        subtotal: 500,
        discount: 0,
        tax: 75,
        total: 575,
        paymentMode: "card" as const,
        cashierId: "2",
        cashierName: "Chaminda Manager",
        date: new Date("2025-10-12T13:40:00"),
        status: "completed" as const,
      },
      {
        id: "demo-6",
        invoiceNumber: "INV-2025-9006",
        customerId: "demo-customer",
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "6",
              name: 'PVC Pipe 1"',
              sku: "PL-001",
              category: "Plumbing",
              brand: "Supreme",
              purchasePrice: 120,
              sellingPrice: 180,
              quantity: 6,
              reorderLevel: 10,
              supplier: 'Plumbing Supplies',
              barcode: '1234567890128',
              description: 'High quality PVC pipe',
              imageUrl: '/products/3.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 3,
            discount: 50,
          },
        ],
        subtotal: 540,
        discount: 50,
        tax: 73,
        total: 563,
        paymentMode: "upi" as const,
        cashierId: "4",
        cashierName: "Rohan Cashier",
        date: new Date("2025-10-08T10:20:00"),
        status: "completed" as const,
      },
      {
        id: "demo-7",
        invoiceNumber: "INV-2025-9007",
        customerId: "demo-customer",
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "5",
              name: "LED Bulb 9W",
              sku: "EL-001",
              category: "Electrical",
              brand: "Philips",
              purchasePrice: 80,
              sellingPrice: 120,
              quantity: 200,
              reorderLevel: 50,
              supplier: 'Electrical Depot',
              barcode: '1234567890127',
              description: 'Energy efficient LED bulb',
              imageUrl: '/products/4.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 8,
            discount: 0,
          },
        ],
        subtotal: 960,
        discount: 0,
        tax: 144,
        total: 1104,
        paymentMode: "credit" as const,
        cashierId: "3",
        cashierName: "Dilini Cashier",
        date: new Date("2025-10-05T15:10:00"),
        status: "completed" as const,
      },
      {
        id: "demo-8",
        invoiceNumber: "INV-2025-9008",
        customerId: "demo-customer",
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "1",
              name: "Hammer",
              sku: "HW-001",
              category: "Hand Tools",
              brand: "Stanley",
              purchasePrice: 150,
              sellingPrice: 250,
              quantity: 45,
              reorderLevel: 10,
              supplier: 'Tools Wholesale',
              barcode: '1234567890123',
              description: 'Professional claw hammer',
              imageUrl: '/products/8.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 1,
            discount: 0,
          },
          {
            product: {
              id: "4",
              name: 'Paint Brush 2"',
              sku: "PT-001",
              category: "Painting",
              brand: "Asian Paints",
              purchasePrice: 50,
              sellingPrice: 85,
              quantity: 120,
              reorderLevel: 30,
              supplier: 'Paint Supplies Co',
              barcode: '1234567890126',
              description: 'Professional paint brush',
              imageUrl: '/products/5.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 3,
            discount: 25,
          },
        ],
        subtotal: 505,
        discount: 25,
        tax: 72,
        total: 552,
        paymentMode: "cash" as const,
        cashierId: "5",
        cashierName: "Sanduni Perera", 
        date: new Date("2025-09-28T12:30:00"),
        status: "completed" as const,
      },
      {
        id: "demo-9",
        invoiceNumber: "INV-2025-9009",
        customerId: "demo-customer",
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "2",
              name: "Screwdriver Set",
              sku: "HW-002",
              category: "Hand Tools", 
              brand: "Bosch",
              purchasePrice: 300,
              sellingPrice: 450,
              quantity: 30,
              reorderLevel: 15,
              supplier: 'Tools Wholesale',
              barcode: '1234567890124',
              description: 'Complete screwdriver set',
              imageUrl: '/products/7.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 1,
            discount: 0,
          },
          {
            product: {
              id: "5",
              name: "LED Bulb 9W",
              sku: "EL-001",
              category: "Electrical",
              brand: "Philips",
              purchasePrice: 80,
              sellingPrice: 120,
              quantity: 200,
              reorderLevel: 50,
              supplier: 'Electrical Depot',
              barcode: '1234567890127',
              description: 'Energy efficient LED bulb',
              imageUrl: '/products/4.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 4,
            discount: 50,
          },
        ],
        subtotal: 930,
        discount: 50,
        tax: 132,
        total: 1012,
        paymentMode: "card" as const,
        cashierId: "4",
        cashierName: "Rohan Cashier",
        date: new Date("2025-09-22T14:45:00"),
        status: "completed" as const,
      },
      {
        id: "demo-10",
        invoiceNumber: "INV-2025-9010",
        customerId: "demo-customer",
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "7",
              name: "Measuring Tape 5M",
              sku: "HW-003",
              category: "Hand Tools",
              brand: "Stanley",
              purchasePrice: 100,
              sellingPrice: 160,
              quantity: 55,
              reorderLevel: 20,
              supplier: 'Tools Wholesale',
              barcode: '1234567890129',
              description: 'Professional measuring tape',
              imageUrl: '/products/2.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 1,
            discount: 0,
          },
        ],
        subtotal: 160,
        discount: 0,
        tax: 24,
        total: 184,
        paymentMode: "upi" as const,
        cashierId: "2",
        cashierName: "Chaminda Manager",
        date: new Date("2025-09-15T11:20:00"),
        status: "completed" as const,
      },
      {
        id: "demo-11",
        invoiceNumber: "INV-2025-9011",
        customerId: "demo-customer",
        customerName: "Demo Customer",
        items: [
          {
            product: {
              id: "2",
              name: "Screwdriver Set",
              sku: "HW-002",
              category: "Hand Tools",
              brand: "Bosch",
              purchasePrice: 300,
              sellingPrice: 450,
              quantity: 30,
              reorderLevel: 15,
              supplier: 'Tools Wholesale',
              barcode: '1234567890124',
              description: 'Complete screwdriver set',
              imageUrl: '/products/7.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 1,
            discount: 0,
          },
          {
            product: {
              id: "5",
              name: "LED Bulb 9W",
              sku: "EL-001",
              category: "Electrical",
              brand: "Philips",
              purchasePrice: 80,
              sellingPrice: 120,
              quantity: 200,
              reorderLevel: 50,
              supplier: 'Electrical Depot',
              barcode: '1234567890127',
              description: 'Energy efficient LED bulb',
              imageUrl: '/products/4.png',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15'),
            },
            quantity: 3,
            discount: 0,
          },
        ],
        subtotal: 810,
        discount: 0,
        tax: 121,
        total: 931,
        paymentMode: "cash" as const,
        cashierId: "3",
        cashierName: "Dilini Cashier",
        date: new Date("2025-10-26T18:30:00"),
        status: "pending" as const,
      },
    ];
    
    customerOrders = demoOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tax</span>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      LKR {order.tax.toLocaleString()}
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