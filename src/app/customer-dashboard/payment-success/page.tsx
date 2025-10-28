"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Download, MapPin, Calendar, CreditCard, Package, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("completed-order");
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    } else {
      router.push("/customer-dashboard/products");
    }
  }, [router]);

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    alert("Invoice download functionality would be implemented here");
  };

  const handleTrackOrder = () => {
    // Navigate to order tracking page
    router.push(`/customer-dashboard/orders?track=${orderData?.orderId}`);
  };

  const handleContinueShopping = () => {
    router.push("/customer-dashboard/products");
  };

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const isPaymentPending = orderData.paymentStatus === "pending";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isPaymentPending ? "Order Confirmed!" : "Payment Successful!"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isPaymentPending 
              ? "Your order has been placed successfully. You'll pay upon delivery."
              : "Thank you for your purchase. Your order has been confirmed."
            }
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Order Details
            </h2>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
              <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                {orderData.orderId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Order Date */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Order Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(orderData.orderDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Payment</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {orderData.paymentMethod === "credit-card" ? "Credit Card" :
                   orderData.paymentMethod === "mobile-payment" ? "Mobile Payment" :
                   orderData.paymentMethod === "bank-transfer" ? "Bank Transfer" :
                   "Cash on Delivery"}
                </p>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
                <p className={`text-sm font-medium ${
                  isPaymentPending 
                    ? "text-yellow-600 dark:text-yellow-400" 
                    : "text-green-600 dark:text-green-400"
                }`}>
                  {isPaymentPending ? "Payment Pending" : "Paid"}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-5 h-5 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded-full">
                <span className="text-xs font-bold text-green-600 dark:text-green-400">₨</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Rs. {orderData.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delivery Address
              </h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">
                {orderData.shippingInfo.fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {orderData.shippingInfo.address}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {orderData.shippingInfo.city}, {orderData.shippingInfo.postalCode}
              </p>
              <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>📞 {orderData.shippingInfo.phone}</span>
                <span>✉️ {orderData.shippingInfo.email}</span>
              </div>
              {orderData.shippingInfo.notes && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Notes:</strong> {orderData.shippingInfo.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Order Items ({orderData.items.length})
          </h3>
          
          <div className="space-y-4">
            {orderData.items.map((item: any) => {
              const discountedPrice = item.product.sellingPrice * (1 - item.discount / 100);
              return (
                <div key={item.product.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="relative w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.imageUrl || "/placeholder-product.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-product.png";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.product.brand} • {item.product.category}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-sm text-gray-400">×</span>
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        Rs. {discountedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Rs. {(discountedPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium">Rs. {orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
              <span className="font-medium">
                {orderData.deliveryFee === 0 ? "Free" : `Rs. ${orderData.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
              <span>Total:</span>
              <span className="text-green-600 dark:text-green-400">Rs. {orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Invoice
          </button>
          
          <button
            onClick={handleTrackOrder}
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Package className="w-5 h-5" />
            Track Order
          </button>
          
          <button
            onClick={handleContinueShopping}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {/* Delivery Timeline */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What happens next?
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Order Confirmed</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">We've received your order</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Processing</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">We're preparing your items (1-2 business days)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Shipped</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your order is on its way</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Delivered</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated delivery: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  {isPaymentPending && " (Payment due on delivery)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}