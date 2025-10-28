'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateCartItem, currentUser, addSale } = useApp();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  // Handle quantity change
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);

    try {
      // Create sale record
      const saleData = {
        customerId: currentUser?.id,
        customerName: currentUser?.name || 'Walk-in Customer',
        items: cart,
        subtotal: subtotal,
        discount: 0, // No discount for customer purchases
        tax: tax,
        total: total,
        paymentMode: 'cash' as const,
        cashierId: 'system', // System-generated for customer purchases
        cashierName: 'Online Purchase',
        status: 'completed' as const,
      };

      addSale(saleData);

      // Clear cart (we'd need to implement this in the context)
      cart.forEach(item => removeFromCart(item.product.id));

      setCheckoutSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/customer-dashboard');
      }, 2000);

    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for your purchase. Your order has been processed.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review your items and complete your purchase.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some products to get started.
          </p>
          <button
            onClick={() => router.push('/customer-dashboard/products')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.log('Cart image failed to load:', item.product.imageUrl);
                        }}
                        onLoad={() => {
                          console.log('Cart image loaded successfully:', item.product.imageUrl);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      SKU: {item.product.sku}
                    </p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
                      LKR {item.product.sellingPrice.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                      disabled={item.quantity >= item.product.quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      LKR {(item.product.sellingPrice * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700 mt-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                      {currentUser?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentUser?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Customer
                    </p>
                  </div>
                </div>
                {currentUser?.phone && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
                {currentUser?.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{currentUser.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">LKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (18% VAT)</span>
                  <span className="text-gray-900 dark:text-white">LKR {tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-orange-600 dark:text-orange-400">LKR {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full mt-6 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Complete Purchase
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}