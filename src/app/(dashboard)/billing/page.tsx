"use client";

import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Customer, PaymentMode } from "@/types";
import {
  Search,
  Tag,
  Percent,
  Plus,
  Minus,
  Trash2,
  User,
  CreditCard,
  X,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export default function Page() {
  const {
    products,
    customers,
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyDiscount,
    addSale,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(18); // GST 18%
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [expandedDiscounts, setExpandedDiscounts] = useState<Set<string>>(
    new Set()
  );
  const [discountTypes, setDiscountTypes] = useState<
    Map<string, "percent" | "amount">
  >(new Map());
  const [discountInputs, setDiscountInputs] = useState<Map<string, string>>(
    new Map()
  );

  // Get unique categories
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery);
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.quantity > 0;
  });

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.product.sellingPrice * item.quantity - item.discount,
    0
  );
  const discountAmount = (subtotal * globalDiscount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    if (!currentUser) {
      alert("Please login first!");
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
      status: "completed" as const,
    };

    addSale(sale);
    generateReceipt(sale);
    clearCart();
    setSelectedCustomer(null);
    setGlobalDiscount(0);
    setExpandedDiscounts(new Set());
    setDiscountTypes(new Map());
    setDiscountInputs(new Map());
    alert("Sale completed successfully!");
  };

  const toggleDiscountSection = (productId: string) => {
    // Allow only one expanded discount at a time. Preserve discount value when collapsing.
    const currentlyExpanded = Array.from(expandedDiscounts);
    // If clicking the currently expanded item -> collapse it (but keep the discount value)
    if (expandedDiscounts.has(productId)) {
      const newExpanded = new Set(expandedDiscounts);
      newExpanded.delete(productId);
      setExpandedDiscounts(newExpanded);
      return;
    }

    // Opening a new product's discount: set that as the only expanded one
    const newExpanded = new Set<string>();
    newExpanded.add(productId);
    setExpandedDiscounts(newExpanded);

    // Initialize discount type to percentage if not present
    if (!discountTypes.has(productId)) {
      const newTypes = new Map(discountTypes);
      newTypes.set(productId, "percent");
      setDiscountTypes(newTypes);
    }
  };

  const handleDiscountChange = (
    productId: string,
    value: string,
    itemTotal: number
  ) => {
    const newInputs = new Map(discountInputs);
    newInputs.set(productId, value);
    setDiscountInputs(newInputs);

    const numValue = Number(value) || 0;
    const discountType = discountTypes.get(productId) || "percent";

    let discountAmount = 0;
    if (discountType === "percent") {
      // Convert percentage to amount
      discountAmount = (itemTotal * Math.min(numValue, 100)) / 100;
    } else {
      // Direct amount, cap at item total
      discountAmount = Math.min(numValue, itemTotal);
    }

    applyDiscount(productId, discountAmount);
  };

  const toggleDiscountType = (productId: string, itemTotal: number) => {
    const newTypes = new Map(discountTypes);
    const currentType = discountTypes.get(productId) || "percent";
    const newType = currentType === "percent" ? "amount" : "percent";
    newTypes.set(productId, newType);
    setDiscountTypes(newTypes);

    // Convert the current input value
    const currentInput = discountInputs.get(productId) || "";
    if (currentInput) {
      const currentValue = Number(currentInput) || 0;
      let newInputValue = "";

      if (newType === "amount") {
        // Converting from percent to amount
        newInputValue = ((itemTotal * currentValue) / 100).toFixed(2);
      } else {
        // Converting from amount to percent
        newInputValue = ((currentValue / itemTotal) * 100).toFixed(1);
      }

      const newInputs = new Map(discountInputs);
      newInputs.set(productId, newInputValue);
      setDiscountInputs(newInputs);
    }
  };

  const generateReceipt = (sale: any) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Hardware Store POS", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text("Invoice Receipt", 105, 22, { align: "center" });
    doc.text("---------------------------------------------------", 105, 27, {
      align: "center",
    });

    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice: INV-${Date.now()}`, 14, 35);
    doc.text(`Date: ${format(new Date(), "dd/MM/yyyy hh:mm a")}`, 14, 40);
    doc.text(`Cashier: ${sale.cashierName}`, 14, 45);
    if (sale.customerName) {
      doc.text(`Customer: ${sale.customerName}`, 14, 50);
    }

    // Items table
    autoTable(doc, {
      startY: sale.customerName ? 55 : 50,
      head: [["Item", "Qty", "Price", "Discount", "Total"]],
      body: cart.map((item) => [
        item.product.name,
        item.quantity,
        `LKR ${item.product.sellingPrice}`,
        `LKR ${item.discount}`,
        `LKR ${(
          item.product.sellingPrice * item.quantity -
          item.discount
        ).toFixed(2)}`,
      ]),
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: LKR ${subtotal.toFixed(2)}`, 14, finalY);
    doc.text(
      `Discount (${globalDiscount}%): -LKR ${discountAmount.toFixed(2)}`,
      14,
      finalY + 5
    );
    doc.text(`Tax (${taxRate}%): LKR ${taxAmount.toFixed(2)}`, 14, finalY + 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: LKR ${total.toFixed(2)}`, 14, finalY + 18);

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your business!", 105, finalY + 30, {
      align: "center",
    });

    doc.save(`invoice-${Date.now()}.pdf`);
  };

  return (
    <div className="p-6 h-full">
      <div className="flex gap-4 h-full">
        {/* Products Section - Left Side */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Billing
            </h1>
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

          {/* Products List (vertical) */}
          <div
            className="flex flex-col gap-2 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 250px)" }}
          >
            {/* Sticky header for columns */}
            <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 px-3 py-2 rounded-t-md border-b border-gray-200 dark:border-gray-700">
              <div className="w-full flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <div className="w-20 shrink-0">ID</div>
                <div className="flex-1">Name</div>
                <div className="w-32">Type</div>
                <div className="w-20 text-center">Stock</div>
                <div className="w-28 text-right">Price</div>
              </div>
            </div>

            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product, 1)}
                className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow transition-shadow text-left"
              >
                <div className="w-full flex items-center gap-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 w-20 shrink-0 whitespace-nowrap">
                    {product.id}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-gray-900 dark:text-white text-sm truncate"
                      title={
                        product.brand
                          ? `${product.brand} ${product.name}`
                          : product.name
                      }
                    >
                      {product.brand
                        ? `${product.brand} ${product.name}`
                        : product.name}
                    </p>
                  </div>

                  {/* Type / Category column (separate) */}
                  <div className="text-sm text-gray-500 dark:text-gray-400 w-32 shrink-0 whitespace-nowrap">
                    {product.category}
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400 w-20 text-center shrink-0 whitespace-nowrap">
                    {product.quantity}
                  </div>

                  <div className="text-right w-28 shrink-0 whitespace-nowrap">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      LKR {product.sellingPrice}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Section - Right Side */}
        <div className="w-[480px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Cart
              </h2>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                <User className="w-4 h-4" />
                {selectedCustomer ? selectedCustomer.name : "Select Customer"}
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 dark:text-gray-500">
                  Cart is empty
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Add products to start billing
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = item.product.sellingPrice * item.quantity;
                const itemDiscountedTotal = itemTotal - item.discount;
                const isDiscountExpanded = expandedDiscounts.has(
                  item.product.id
                );
                const discountType =
                  discountTypes.get(item.product.id) || "percent";
                const discountInput = discountInputs.get(item.product.id) || "";

                return (
                  <div
                    key={item.product.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                  >
                    {/* Compact Product Row */}
                    <div className="flex items-center justify-between gap-3">
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-medium text-gray-900 dark:text-white text-sm"
                          title={item.product.name}
                        >
                          {item.product.name}
                        </h4>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateCartItem(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItem(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.quantity}
                          className="w-7 h-7 bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center gap-2">
                        <div className="text-right min-w-[70px]">
                          {item.discount > 0 ? (
                            <>
                              <p className="text-xs text-gray-400 dark:text-gray-500 line-through">
                                LKR {itemTotal.toFixed(2)}
                              </p>
                              <p className="font-semibold text-sm text-blue-600 dark:text-blue-400">
                                LKR {itemDiscountedTotal.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                              LKR {itemTotal.toFixed(2)}
                            </p>
                          )}
                        </div>

                        {/* Discount Toggle Button */}
                        <button
                          onClick={() => toggleDiscountSection(item.product.id)}
                          className={`p-1.5 rounded transition-colors ${
                            isDiscountExpanded || item.discount > 0
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500"
                          }`}
                          title="Add discount"
                        >
                          <Tag className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Discount Section */}
                    {isDiscountExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder={
                              discountType === "percent" ? "0" : "0.00"
                            }
                            value={discountInput}
                            onChange={(e) =>
                              handleDiscountChange(
                                item.product.id,
                                e.target.value,
                                itemTotal
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                            min="0"
                            max={discountType === "percent" ? 100 : itemTotal}
                            step={discountType === "percent" ? "1" : "0.01"}
                          />
                          <button
                            onClick={() =>
                              toggleDiscountType(item.product.id, itemTotal)
                            }
                            className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5 text-sm font-medium min-w-[60px] justify-center"
                            title={`Switch to ${
                              discountType === "percent"
                                ? "amount"
                                : "percentage"
                            }`}
                          >
                            {discountType === "percent" ? (
                              <>
                                <Percent className="w-4 h-4" />%
                              </>
                            ) : (
                              <>LKR</>
                            )}
                          </button>
                        </div>

                        {item.discount > 0 && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-md px-3 py-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-green-700 dark:text-green-400 font-medium">
                                Discount Applied:
                              </span>
                              <span className="text-green-700 dark:text-green-400 font-semibold">
                                LKR {item.discount.toFixed(2)} (
                                {((item.discount / itemTotal) * 100).toFixed(1)}
                                %)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Show discount info even when collapsed if discount exists */}
                    {!isDiscountExpanded && item.discount > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Discount: -LKR {item.discount.toFixed(2)} (
                          {((item.discount / itemTotal) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
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
                  value={globalDiscount || ""}
                  onChange={(e) =>
                    setGlobalDiscount(Number(e.target.value) || 0)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                  max="100"
                />
                <input
                  type="number"
                  placeholder="Tax %"
                  value={taxRate || ""}
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
                  <span>LKR {subtotal.toFixed(2)}</span>
                </div>
                {globalDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({globalDiscount}%):</span>
                    <span>-LKR {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax ({taxRate}%):</span>
                  <span>LKR {taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total:</span>
                  <span>LKR {total.toFixed(2)}</span>
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Customer
              </h3>
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
                <p className="font-medium text-gray-900 dark:text-white">
                  Walk-in Customer
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No customer details
                </p>
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
                      ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500"
                      : "bg-gray-50 dark:bg-gray-700"
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.phone}
                  </p>
                  {customer.outstandingBalance > 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Due: LKR {customer.outstandingBalance}
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
