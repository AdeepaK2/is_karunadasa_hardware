"use client";

import React from "react";
import { useApp } from "@/contexts/AppContext";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

export default function DashboardPage() {
  const { hasAccess } = useRouteProtection();
  const { products, customers, sales, employees } = useApp();

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const today = startOfDay(new Date());
  const todaySales = sales.filter(
    (sale) => startOfDay(new Date(sale.date)).getTime() === today.getTime()
  );

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const monthRevenue = sales
    .filter((sale) => new Date(sale.date).getMonth() === new Date().getMonth())
    .reduce((sum, sale) => sum + sale.total, 0);

  const lowStockItems = products.filter((p) => p.quantity <= p.reorderLevel);
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.sellingPrice * p.quantity,
    0
  );

  // Chart data - Last 7 days sales
  const salesChartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const daySales = sales.filter(
      (sale) => startOfDay(new Date(sale.date)).getTime() === date.getTime()
    );
    const revenue = daySales.reduce((sum, sale) => sum + sale.total, 0);
    return {
      date: format(date, "MMM dd"),
      revenue: revenue,
      orders: daySales.length,
    };
  });

  // Top selling products
  const productSales: Record<string, number> = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productSales[item.product.id]) {
        productSales[item.product.id] = 0;
      }
      productSales[item.product.id] += item.quantity;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, qty]) => ({
      product: products.find((p) => p.id === id),
      quantity: qty,
    }))
    .filter((item) => item.product);

  const stats = [
    {
      name: "Today's Sales",
      value: `LKR ${todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+12.5%",
      color: "bg-green-500",
    },
    {
      name: "Monthly Revenue",
      value: `LKR ${monthRevenue.toLocaleString()}`,
      icon: TrendingUp,
      change: "+8.2%",
      color: "bg-blue-500",
    },
    {
      name: "Total Customers",
      value: customers.length,
      icon: Users,
      change: "+3",
      color: "bg-purple-500",
    },
    {
      name: "Low Stock Items",
      value: lowStockItems.length,
      icon: AlertTriangle,
      change: "Urgent",
      color: "bg-red-500",
    },
    {
      name: "Today's Orders",
      value: todaySales.length,
      icon: ShoppingCart,
      change: `${todaySales.length} orders`,
      color: "bg-orange-500",
    },
    {
      name: "Inventory Value",
      value: `LKR ${totalInventoryValue.toLocaleString()}`,
      icon: Package,
      change: "Total",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales Overview (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tw-bg-opacity)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fill="#93c5fd"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Selling Products
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis
                dataKey="product.name"
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tw-bg-opacity)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="quantity" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Sales
          </h3>
          <div className="space-y-4">
            {sales.slice(0, 5).map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {sale.invoiceNumber}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {sale.customerName || "Walk-in Customer"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    LKR {sale.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(sale.date), "MMM dd, hh:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Low Stock Alert
          </h3>
          <div className="space-y-4">
            {lowStockItems.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    SKU: {product.sku}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    {product.quantity} units
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Reorder: {product.reorderLevel}
                  </p>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                All products are well stocked! 🎉
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Active Employees */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Team Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  employee.attendanceStatus === "present"
                    ? "bg-green-100 dark:bg-green-900"
                    : employee.attendanceStatus === "leave"
                    ? "bg-yellow-100 dark:bg-yellow-900"
                    : "bg-red-100 dark:bg-red-900"
                }`}
              >
                <span className="text-lg font-semibold">
                  {employee.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {employee.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {employee.role} • {employee.attendanceStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
