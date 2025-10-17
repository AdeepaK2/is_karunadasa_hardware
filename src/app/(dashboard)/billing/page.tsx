'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Search, Plus, Minus, Trash2, User, CreditCard, Printer, X } from 'lucide-react';
import { Product, Customer, CartItem, PaymentMode } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export default function BillingPage() {
  const { products, customers, cart, addToCart, updateCartItem, removeFromCart, clearCart, applyDiscount, addSale, currentUser } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(18); // GST 18%
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Get unique categories
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.quantity > 0;
  });

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity - item.discount,
    0
  );
  const discountAmount = (subtotal * globalDiscount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!currentUser) {
      alert('Please login first!');
      return;
    }

    const sale = {
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name,
      items: cart,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paymentMode,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      status: 'completed' as const,
    };

    addSale(sale);
    generateReceipt(sale);
    clearCart();
    setSelectedCustomer(null);
    setGlobalDiscount(0);
    alert('Sale completed successfully!');
  };

  const generateReceipt = (sale: any) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('Hardware Store POS', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Invoice Receipt', 105, 22, { align: 'center' });
    doc.text('---------------------------------------------------', 105, 27, { align: 'center' });

    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice: INV-${Date.now()}`, 14, 35);
    doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy hh:mm a')}`, 14, 40);
    doc.text(`Cashier: ${sale.cashierName}`, 14, 45);
    if (sale.customerName) {
      doc.text(`Customer: ${sale.customerName}`, 14, 50);
    }

    // Items table
    autoTable(doc, {
      startY: sale.customerName ? 55 : 50,
      head: [['Item', 'Qty', 'Price', 'Discount', 'Total']],
      body: cart.map((item) => [
        item.product.name,
        item.quantity,
        `₹${item.product.sellingPrice}`,
        `₹${item.discount}`,
        `₹${(item.product.sellingPrice * item.quantity - item.discount).toFixed(2)}`,
      ]),
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 14, finalY);
    doc.text(`Discount (${globalDiscount}%): -₹${discountAmount.toFixed(2)}`, 14, finalY + 5);
    doc.text(`Tax (${taxRate}%): ₹${taxAmount.toFixed(2)}`, 14, finalY + 10);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ₹${total.toFixed(2)}`, 14, finalY + 18);

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', 105, finalY + 30, { align: 'center' });

    doc.save(`invoice-${Date.now()}.pdf`);
  };

  return (
    <div className="p-6 h-full">
      <div className="flex gap-6 h-full">
        {/* Products Section - Left Side */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product, 1)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow text-left"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.brand}</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                  ₹{product.sellingPrice}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Stock: {product.quantity}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Section - Right Side */}
        <div className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cart</h2>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                <User className="w-4 h-4" />
                {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 dark:text-gray-500">Cart is empty</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Add products to start billing
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ₹{item.product.sellingPrice} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartItem(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItem(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.quantity}
                        className="w-7 h-7 bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500 disabled:opacity-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{(item.product.sellingPrice * item.quantity - item.discount).toFixed(2)}
                    </span>
                  </div>

                  {item.discount > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Discount: -₹{item.discount}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {/* Discount & Tax */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Discount %"
                  value={globalDiscount || ''}
                  onChange={(e) => setGlobalDiscount(Number(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                  max="100"
                />
                <input
                  type="number"
                  placeholder="Tax %"
                  value={taxRate || ''}
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                  max="100"
                />
              </div>

              {/* Payment Mode */}
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="credit">Credit</option>
              </select>

              {/* Totals */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {globalDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({globalDiscount}%):</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax ({taxRate}%):</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Customer</h3>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setShowCustomerModal(false);
                }}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <p className="font-medium text-gray-900 dark:text-white">Walk-in Customer</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">No customer details</p>
              </button>
              {customers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    selectedCustomer?.id === customer.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
                  {customer.outstandingBalance > 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Due: ₹{customer.outstandingBalance}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
