"use client";

import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Receipt,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Customer } from "@/types";
import { format } from "date-fns";

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, sales } =
    useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    nic: "",
    outstandingBalance: 0,
    loyaltyPoints: 0,
  });
  const [countryCode, setCountryCode] = useState("+94");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nicError, setNicError] = useState("");

  // Validate NIC number (Old: 9 digits + V/X, New: 12 digits)
  const validateNIC = (nic: string): boolean => {
    if (!nic) {
      setNicError("NIC number is required");
      return false;
    }

    // Remove spaces and convert to uppercase
    const cleanNIC = nic.replace(/\s/g, "").toUpperCase();

    // Old NIC format: 9 digits followed by V or X
    const oldNICPattern = /^\d{9}[VX]$/;
    // New NIC format: 12 digits
    const newNICPattern = /^\d{12}$/;

    if (oldNICPattern.test(cleanNIC) || newNICPattern.test(cleanNIC)) {
      setNicError("");
      return true;
    }

    setNicError(
      "Invalid NIC format. Use 9 digits + V/X (old) or 12 digits (new)"
    );
    return false;
  };

  const filteredCustomers = customers.filter((customer) => {
    // Search filter
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.nic?.includes(searchQuery);

    // Type filter
    let matchesType = true;
    if (filterType === "regular") {
      matchesType = customer.outstandingBalance === 0;
    } else if (filterType === "credit") {
      matchesType =
        customer.outstandingBalance > 0 && customer.outstandingBalance < 100000;
    } else if (filterType === "high-credit") {
      matchesType =
        customer.outstandingBalance >= 90000 &&
        customer.outstandingBalance < 100000;
    } else if (filterType === "over-limit") {
      matchesType = customer.outstandingBalance >= 100000;
    }

    return matchesSearch && matchesType;
  });

  // Get customer purchases
  const getCustomerPurchases = (customerId: string) => {
    return sales
      .filter((sale) => sale.customerId === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Show last 5 purchases
  };

  const togglePurchaseHistory = (customerId: string) => {
    setExpandedCustomerId(
      expandedCustomerId === customerId ? null : customerId
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate NIC before submitting
    if (!validateNIC(formData.nic)) {
      return;
    }

    // Combine country code and phone number
    const fullPhone = `${countryCode} ${phoneNumber}`;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, { ...formData, phone: fullPhone });
    } else {
      addCustomer({ ...formData, phone: fullPhone });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      nic: "",
      outstandingBalance: 0,
      loyaltyPoints: 0,
    });
    setCountryCode("+94");
    setPhoneNumber("");
    setNicError("");
    setEditingCustomer(null);
    setShowModal(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);

    // Split phone number into country code and number
    const phoneParts = customer.phone.trim().split(/\s+/);
    if (phoneParts.length > 1 && phoneParts[0].startsWith("+")) {
      setCountryCode(phoneParts[0]);
      setPhoneNumber(phoneParts.slice(1).join(" "));
    } else {
      setCountryCode("+94");
      setPhoneNumber(customer.phone);
    }

    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
      nic: customer.nic || "",
      outstandingBalance: customer.outstandingBalance,
      loyaltyPoints: customer.loyaltyPoints,
    });
    setNicError("");
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer(id);
    }
  };

  const totalOutstanding = customers.reduce(
    (sum, c) => sum + c.outstandingBalance,
    0
  );

  const customersOverLimit = customers.filter(
    (c) => c.outstandingBalance > 100000
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer information and track transactions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Customers
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {customers.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Outstanding Amount
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            LKR {totalOutstanding.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Credit Customers
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {customers.filter((c) => c.outstandingBalance > 0).length}
          </p>
        </div>
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg p-4 border ${
            customersOverLimit > 0
              ? "border-red-500 dark:border-red-500"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Over Credit Limit
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              customersOverLimit > 0
                ? "text-red-600 dark:text-red-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {customersOverLimit}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers by name, phone, NIC, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Customers</option>
            <option value="regular">Regular (No Credit)</option>
            <option value="credit">Credit Customers</option>
            <option value="high-credit">High Credit (90k-100k)</option>
            <option value="over-limit">Over Limit (≥100k)</option>
          </select>
        </div>
        {/* Results Count */}
        {(filterType !== "all" || searchQuery) && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredCustomers.length} of {customers.length} customers
            {filterType !== "all" && (
              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                {filterType === "regular" && "Regular"}
                {filterType === "credit" && "Credit"}
                {filterType === "high-credit" && "High Credit"}
                {filterType === "over-limit" && "Over Limit"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                No customers found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Try changing the filter or add a new customer"}
              </p>
            </div>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const customerPurchases = getCustomerPurchases(customer.id);
            const isExpanded = expandedCustomerId === customer.id;

            return (
              <div
                key={customer.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {customer.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {customer.loyaltyPoints} points
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.nic && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <span>{customer.nic}</span>
                    </div>
                  )}
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}
                  {customer.outstandingBalance > 0 && (
                    <div
                      className={`flex items-center gap-2 text-sm mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 ${
                        customer.outstandingBalance > 100000
                          ? "text-red-700 dark:text-red-400 font-bold"
                          : customer.outstandingBalance > 90000
                          ? "text-orange-600 dark:text-orange-400 font-semibold"
                          : "text-red-600 dark:text-red-400 font-semibold"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>
                        Due: LKR {customer.outstandingBalance.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {customer.lastPurchase && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last purchase:{" "}
                      {format(new Date(customer.lastPurchase), "MMM dd, yyyy")}
                    </p>
                  )}

                  {/* Purchase History Toggle */}
                  {customerPurchases.length > 0 && (
                    <>
                      <button
                        onClick={() => togglePurchaseHistory(customer.id)}
                        className="w-full mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <span className="flex items-center gap-2">
                          <Receipt className="w-4 h-4" />
                          Purchase History ({customerPurchases.length})
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {/* Purchase History Details */}
                      {isExpanded && (
                        <div className="mt-3 space-y-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          {customerPurchases.map((sale) => (
                            <div
                              key={sale.id}
                              className="text-xs space-y-1 pb-2 border-b border-gray-200 dark:border-gray-600 last:border-0 last:pb-0"
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {sale.invoiceNumber}
                                </span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                  LKR {sale.total.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>
                                  {format(new Date(sale.date), "MMM dd, yyyy")}
                                </span>
                                <span className="capitalize">
                                  {sale.paymentMode}
                                </span>
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {sale.items.length} item
                                {sale.items.length !== 1 ? "s" : ""}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="+94"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="71 234 5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Default country code is +94 (Sri Lanka)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  NIC Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="993456789V or 200012345678"
                  value={formData.nic}
                  onChange={(e) => {
                    setFormData({ ...formData, nic: e.target.value });
                    setNicError("");
                  }}
                  onBlur={() => validateNIC(formData.nic)}
                  className={`w-full px-3 py-2 border ${
                    nicError
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                />
                {nicError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {nicError}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Old format: 9 digits + V/X | New format: 12 digits
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Outstanding Balance
                  </label>
                  <input
                    type="number"
                    value={formData.outstandingBalance || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        outstandingBalance: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Loyalty Points
                  </label>
                  <input
                    type="number"
                    value={formData.loyaltyPoints || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loyaltyPoints: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCustomer ? "Update Customer" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
