"use client";

import React, { useMemo } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Package,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Product } from "@/types";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  subYears,
} from "date-fns";

interface ProductSalesAnalyticsProps {
  product: Product;
  onClose: () => void;
}

export default function ProductSalesAnalytics({
  product,
  onClose,
}: ProductSalesAnalyticsProps) {
  const { sales } = useApp();

  // Calculate sales data for the product
  const salesData = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));
    const lastYearStart = startOfMonth(subYears(now, 1));
    const lastYearEnd = endOfMonth(subYears(now, 1));

    // Filter sales containing this product
    const productSales = sales.filter((sale) =>
      sale.items.some((item) => item.product.id === product.id)
    );

    // Calculate last 12 months sales data (2025)
    const last12MonthsData = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(subMonths(now, i));

      const monthSales = productSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate >= monthStart && saleDate <= monthEnd;
      });

      const monthQty = monthSales.reduce((sum, sale) => {
        const item = sale.items.find((item) => item.product.id === product.id);
        return sum + (item?.quantity || 0);
      }, 0);

      last12MonthsData.push({
        month: format(monthStart, "MMM yyyy"),
        monthShort: format(monthStart, "MMM"),
        quantity: monthQty,
        monthDate: monthStart,
      });
    }

    // Calculate same months from 2024 for comparison
    const last12Months2024Data = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart2024 = startOfMonth(subMonths(subYears(now, 1), i));
      const monthEnd2024 = endOfMonth(subMonths(subYears(now, 1), i));

      const monthSales2024 = productSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate >= monthStart2024 && saleDate <= monthEnd2024;
      });

      const monthQty2024 = monthSales2024.reduce((sum, sale) => {
        const item = sale.items.find((item) => item.product.id === product.id);
        return sum + (item?.quantity || 0);
      }, 0);

      last12Months2024Data.push({
        month: format(monthStart2024, "MMM yyyy"),
        monthShort: format(monthStart2024, "MMM"),
        quantity: monthQty2024,
        monthDate: monthStart2024,
      });
    }

    // Find top 3 months (from 2025 data)
    const sortedMonths = [...last12MonthsData].sort(
      (a, b) => b.quantity - a.quantity
    );
    const top3Months = sortedMonths.slice(0, 3).map((m) => m.month);

    // Current month sales
    const currentMonthSales = productSales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= currentMonthStart && saleDate <= currentMonthEnd;
    });

    const currentMonthQty = currentMonthSales.reduce((sum, sale) => {
      const item = sale.items.find((i) => i.product.id === product.id);
      return sum + (item?.quantity || 0);
    }, 0);

    // Last month sales
    const lastMonthSales = productSales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= lastMonthStart && saleDate <= lastMonthEnd;
    });

    const lastMonthQty = lastMonthSales.reduce((sum, sale) => {
      const item = sale.items.find((i) => i.product.id === product.id);
      return sum + (item?.quantity || 0);
    }, 0);

    // Same month last year sales
    const lastYearSales = productSales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= lastYearStart && saleDate <= lastYearEnd;
    });

    const lastYearQty = lastYearSales.reduce((sum, sale) => {
      const item = sale.items.find((i) => i.product.id === product.id);
      return sum + (item?.quantity || 0);
    }, 0);

    // Calculate monthly average (last 3 months)
    const threeMonthsAgo = startOfMonth(subMonths(now, 3));
    const threeMonthsSales = productSales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= threeMonthsAgo;
    });

    const threeMonthsQty = threeMonthsSales.reduce((sum, sale) => {
      const item = sale.items.find((i) => i.product.id === product.id);
      return sum + (item?.quantity || 0);
    }, 0);

    const avgMonthlyQty = threeMonthsQty / 3;

    // Calculate percentage changes
    const monthOverMonthChange =
      lastMonthQty === 0
        ? currentMonthQty > 0
          ? 100
          : 0
        : ((currentMonthQty - lastMonthQty) / lastMonthQty) * 100;

    const yearOverYearChange =
      lastYearQty === 0
        ? currentMonthQty > 0
          ? 100
          : 0
        : ((currentMonthQty - lastYearQty) / lastYearQty) * 100;

    // Calculate restock recommendation
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const dailySalesRate = currentMonthQty / now.getDate();
    const projectedMonthlyDemand = dailySalesRate * daysInMonth;

    const daysOfStockLeft =
      dailySalesRate > 0 ? product.quantity / dailySalesRate : Infinity;

    return {
      currentMonthQty,
      lastMonthQty,
      lastYearQty,
      avgMonthlyQty,
      monthOverMonthChange,
      yearOverYearChange,
      projectedMonthlyDemand,
      daysOfStockLeft,
      currentMonthSales: currentMonthSales.length,
      totalRevenue: currentMonthSales.reduce((sum, sale) => {
        const item = sale.items.find((i) => i.product.id === product.id);
        if (!item) return sum;
        return sum + item.product.sellingPrice * item.quantity - item.discount;
      }, 0),
      last12MonthsData,
      last12Months2024Data,
      top3Months,
    };
  }, [sales, product]);

  // Determine restock urgency
  const getRestockUrgency = () => {
    if (product.quantity === 0) {
      return {
        level: "critical",
        message: "Out of Stock - Restock Immediately!",
        color: "red",
      };
    }
    if (product.quantity <= product.reorderLevel) {
      return {
        level: "high",
        message: "Below Reorder Level - Restock Soon",
        color: "orange",
      };
    }
    if (salesData.daysOfStockLeft < 7) {
      return {
        level: "medium",
        message: "Stock Running Low - Plan Restock",
        color: "yellow",
      };
    }
    if (salesData.daysOfStockLeft < 14) {
      return {
        level: "low",
        message: "Stock Adequate - Monitor",
        color: "blue",
      };
    }
    return { level: "good", message: "Stock Level Good", color: "green" };
  };

  const urgency = getRestockUrgency();

  // Calculate recommended restock quantity
  const recommendedRestock = Math.max(
    0,
    Math.ceil(salesData.avgMonthlyQty * 1.5) - product.quantity
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Sales Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {product.name} ({product.sku})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Stock Info */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current Stock
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {product.quantity}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reorder Level
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {product.reorderLevel}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selling Price
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  LKR {product.sellingPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <p className="text-sm text-green-800 dark:text-green-300 mb-2">
              Revenue (Current Month)
            </p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-200 mb-4">
              LKR {salesData.totalRevenue.toLocaleString()}
            </p>
            <div className="border-t border-green-300 dark:border-green-700 pt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700 dark:text-green-400">
                  Units Sold:
                </span>
                <span className="font-semibold text-green-900 dark:text-green-200">
                  {salesData.currentMonthQty} units
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700 dark:text-green-400">
                  Transactions:
                </span>
                <span className="font-semibold text-green-900 dark:text-green-200">
                  {salesData.currentMonthSales}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700 dark:text-green-400">
                  Price per Unit:
                </span>
                <span className="font-semibold text-green-900 dark:text-green-200">
                  LKR {product.sellingPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-green-600 dark:text-green-400 pt-2 border-t border-green-200 dark:border-green-700">
                <span>Avg Revenue per Transaction:</span>
                <span className="font-medium">
                  LKR{" "}
                  {salesData.currentMonthSales > 0
                    ? Math.round(
                        salesData.totalRevenue / salesData.currentMonthSales
                      ).toLocaleString()
                    : 0}
                </span>
              </div>
            </div>
          </div>

          {/* 12-Month Sales Trend Chart */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-bold text-xl text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  12-Month Sales Trend
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Visual representation of monthly sales patterns
                </p>
              </div>
            </div>

            {/* Top 3 Months Badge */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Top 3 Months:
              </span>
              {salesData.top3Months.map((month, index) => (
                <span
                  key={month}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    index === 0
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      : index === 1
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                  }`}
                >
                  {index === 0 ? "#1" : index === 1 ? "#2" : "#3"} {month}
                </span>
              ))}
            </div>

            {/* Bar Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              {/* SVG Line Chart */}
              <div className="w-full" style={{ height: "300px" }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 300"
                  preserveAspectRatio="xMidYMid meet"
                  className="overflow-visible"
                >
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => {
                    const y = 40 + (i * 200) / 4;
                    return (
                      <g key={`grid-${i}`}>
                        <line
                          x1="60"
                          y1={y}
                          x2="760"
                          y2={y}
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          className="text-gray-300 dark:text-gray-600"
                        />
                      </g>
                    );
                  })}

                  {/* Y-axis labels */}
                  {(() => {
                    const maxQty = Math.max(
                      ...salesData.last12MonthsData.map((m) => m.quantity),
                      ...salesData.last12Months2024Data.map((m) => m.quantity),
                      1
                    );
                    return [0, 1, 2, 3, 4].map((i) => {
                      const value = Math.round(maxQty - (i * maxQty) / 4);
                      const y = 40 + (i * 200) / 4;
                      return (
                        <text
                          key={`y-label-${i}`}
                          x="50"
                          y={y + 5}
                          textAnchor="end"
                          className="text-xs fill-gray-600 dark:fill-gray-400"
                        >
                          {value}
                        </text>
                      );
                    });
                  })()}

                  {/* Line path for 2025 (current year) */}
                  {(() => {
                    const maxQty = Math.max(
                      ...salesData.last12MonthsData.map((m) => m.quantity),
                      ...salesData.last12Months2024Data.map((m) => m.quantity),
                      1
                    );
                    const points = salesData.last12MonthsData.map(
                      (data, index) => {
                        const x = 60 + (index * 700) / 11;
                        const y = 240 - (data.quantity / maxQty) * 200;
                        return { x, y, data };
                      }
                    );

                    const pathData = points
                      .map(
                        (point, index) =>
                          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
                      )
                      .join(" ");

                    return (
                      <>
                        {/* Area under the 2025 line (gradient fill) */}
                        <defs>
                          <linearGradient
                            id="lineGradient2025"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="rgb(59, 130, 246)"
                              stopOpacity="0.3"
                            />
                            <stop
                              offset="100%"
                              stopColor="rgb(59, 130, 246)"
                              stopOpacity="0.05"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d={`${pathData} L ${
                            points[points.length - 1].x
                          } 240 L 60 240 Z`}
                          fill="url(#lineGradient2025)"
                        />

                        {/* Main 2025 line */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke="rgb(59, 130, 246)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* 2025 Data points */}
                        {points.map((point, index) => {
                          const isTop3 = salesData.top3Months.includes(
                            point.data.month
                          );
                          const isCurrentMonth =
                            point.data.month === format(new Date(), "MMM yyyy");

                          return (
                            <g key={`point-2025-${index}`}>
                              {/* Outer circle for emphasis */}
                              {(isTop3 || isCurrentMonth) && (
                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r="8"
                                  className={
                                    isCurrentMonth
                                      ? "fill-blue-200 dark:fill-blue-800"
                                      : "fill-purple-200 dark:fill-purple-800"
                                  }
                                />
                              )}

                              {/* Main point */}
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="5"
                                className={
                                  isCurrentMonth
                                    ? "fill-blue-600 dark:fill-blue-400"
                                    : isTop3
                                    ? "fill-purple-600 dark:fill-purple-400"
                                    : "fill-white dark:fill-gray-800"
                                }
                                stroke={
                                  isCurrentMonth
                                    ? "rgb(37, 99, 235)"
                                    : isTop3
                                    ? "rgb(147, 51, 234)"
                                    : "rgb(59, 130, 246)"
                                }
                                strokeWidth="2"
                              />

                              {/* Value label on hover */}
                              <g className="opacity-0 hover:opacity-100 transition-opacity">
                                <rect
                                  x={point.x - 25}
                                  y={point.y - 35}
                                  width="50"
                                  height="26"
                                  rx="4"
                                  className="fill-blue-600 dark:fill-blue-500"
                                  opacity="0.95"
                                />
                                <text
                                  x={point.x}
                                  y={point.y - 22}
                                  textAnchor="middle"
                                  className="text-xs font-semibold fill-white"
                                >
                                  2025
                                </text>
                                <text
                                  x={point.x}
                                  y={point.y - 12}
                                  textAnchor="middle"
                                  className="text-xs font-bold fill-white"
                                >
                                  {point.data.quantity}
                                </text>
                              </g>
                            </g>
                          );
                        })}

                        {/* Medal icons for top 3 */}
                        {points.map((point, index) => {
                          const topIndex = salesData.top3Months.indexOf(
                            point.data.month
                          );
                          if (topIndex === -1) return null;

                          const medal =
                            topIndex === 0
                              ? "#1"
                              : topIndex === 1
                              ? "#2"
                              : "#3";

                          return (
                            <text
                              key={`medal-${index}`}
                              x={point.x}
                              y={point.y - 15}
                              textAnchor="middle"
                              className="text-sm"
                            >
                              {medal}
                            </text>
                          );
                        })}
                      </>
                    );
                  })()}

                  {/* Line path for 2024 (previous year) */}
                  {(() => {
                    const maxQty = Math.max(
                      ...salesData.last12MonthsData.map((m) => m.quantity),
                      ...salesData.last12Months2024Data.map((m) => m.quantity),
                      1
                    );
                    const points2024 = salesData.last12Months2024Data.map(
                      (data, index) => {
                        const x = 60 + (index * 700) / 11;
                        const y = 240 - (data.quantity / maxQty) * 200;
                        return { x, y, data };
                      }
                    );

                    const pathData2024 = points2024
                      .map(
                        (point, index) =>
                          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
                      )
                      .join(" ");

                    return (
                      <>
                        {/* 2024 line (dashed) */}
                        <path
                          d={pathData2024}
                          fill="none"
                          stroke="rgb(168, 85, 247)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="5 5"
                        />

                        {/* 2024 Data points */}
                        {points2024.map((point, index) => (
                          <g key={`point-2024-${index}`}>
                            {/* Main point */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              className="fill-purple-500 dark:fill-purple-400"
                              stroke="rgb(168, 85, 247)"
                              strokeWidth="2"
                            />

                            {/* Value label on hover */}
                            <g className="opacity-0 hover:opacity-100 transition-opacity">
                              <rect
                                x={point.x - 25}
                                y={point.y + 10}
                                width="50"
                                height="26"
                                rx="4"
                                className="fill-purple-600 dark:fill-purple-500"
                                opacity="0.95"
                              />
                              <text
                                x={point.x}
                                y={point.y + 23}
                                textAnchor="middle"
                                className="text-xs font-semibold fill-white"
                              >
                                2024
                              </text>
                              <text
                                x={point.x}
                                y={point.y + 33}
                                textAnchor="middle"
                                className="text-xs font-bold fill-white"
                              >
                                {point.data.quantity}
                              </text>
                            </g>
                          </g>
                        ))}
                      </>
                    );
                  })()}

                  {/* X-axis labels */}
                  {salesData.last12MonthsData.map((data, index) => {
                    const x = 60 + (index * 700) / 11;
                    const isCurrentMonth =
                      data.month === format(new Date(), "MMM yyyy");
                    return (
                      <text
                        key={`x-label-${index}`}
                        x={x}
                        y="265"
                        textAnchor="middle"
                        className={`text-xs font-medium ${
                          isCurrentMonth
                            ? "fill-blue-600 dark:fill-blue-400"
                            : "fill-gray-600 dark:fill-gray-400"
                        }`}
                      >
                        {data.monthShort}
                      </text>
                    );
                  })}

                  {/* X-axis line */}
                  <line
                    x1="60"
                    y1="240"
                    x2="760"
                    y2="240"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400 dark:text-gray-600"
                  />

                  {/* Y-axis line */}
                  <line
                    x1="60"
                    y1="40"
                    x2="60"
                    y2="240"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400 dark:text-gray-600"
                  />

                  {/* Y-axis label */}
                  <text
                    x="20"
                    y="140"
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-600 dark:fill-gray-400"
                    transform="rotate(-90 20 140)"
                  >
                    Units Sold
                  </text>

                  {/* X-axis label */}
                  <text
                    x="410"
                    y="290"
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-600 dark:fill-gray-400"
                  >
                    Month
                  </text>
                </svg>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  2025 (Current Year)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <svg width="32" height="4">
                    <line
                      x1="0"
                      y1="2"
                      x2="32"
                      y2="2"
                      stroke="rgb(168, 85, 247)"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                    />
                  </svg>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  2024 (Previous Year)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-700"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Current Month
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-purple-700"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Top 3 Months
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
