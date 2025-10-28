'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  X, 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  AlertCircle,
  Lightbulb,
  BarChart3,
  Calendar,
  DollarSign,
  Users,
  Target
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface AIInsightsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIInsightsSidebar({ isOpen, onClose }: AIInsightsSidebarProps) {
  const { products, sales, customers, expenses } = useApp();
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'recommendations'>('insights');

  // AI-powered analytics calculations
  const aiInsights = useMemo(() => {
    const last30Days = sales.filter(sale => 
      new Date(sale.date) >= subDays(new Date(), 30)
    );
    
    const last7Days = sales.filter(sale => 
      new Date(sale.date) >= subDays(new Date(), 7)
    );

    // Product performance analysis
    const productSales: Record<string, { quantity: number; revenue: number; name: string }> = {};
    last30Days.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.product.id]) {
          productSales[item.product.id] = { 
            quantity: 0, 
            revenue: 0,
            name: item.product.name 
          };
        }
        productSales[item.product.id].quantity += item.quantity;
        productSales[item.product.id].revenue += item.product.sellingPrice * item.quantity;
      });
    });

    const topPerformers = Object.entries(productSales)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 3)
      .map(([id, data]) => ({
        id,
        ...data,
        product: products.find(p => p.id === id)
      }));

    const underperformers = Object.entries(productSales)
      .sort(([, a], [, b]) => a.revenue - b.revenue)
      .slice(0, 3)
      .map(([id, data]) => ({
        id,
        ...data,
        product: products.find(p => p.id === id)
      }));

    // Revenue trends
    const weekRevenue = last7Days.reduce((sum, sale) => sum + sale.total, 0);
    const prevWeekSales = sales.filter(sale => {
      const date = new Date(sale.date);
      return date >= subDays(new Date(), 14) && date < subDays(new Date(), 7);
    });
    const prevWeekRevenue = prevWeekSales.reduce((sum, sale) => sum + sale.total, 0);
    const revenueGrowth = prevWeekRevenue > 0 
      ? ((weekRevenue - prevWeekRevenue) / prevWeekRevenue * 100).toFixed(1)
      : 0;

    // Stock turnover analysis
    const fastMoving = products
      .filter(p => {
        const sold = productSales[p.id]?.quantity || 0;
        return sold > p.quantity * 0.3; // Sold more than 30% of stock
      })
      .slice(0, 5);

    const slowMoving = products
      .filter(p => {
        const sold = productSales[p.id]?.quantity || 0;
        return sold < p.quantity * 0.1 && p.quantity > 0; // Sold less than 10% of stock
      })
      .slice(0, 5);

    // Customer insights
    const avgOrderValue = last30Days.length > 0
      ? last30Days.reduce((sum, sale) => sum + sale.total, 0) / last30Days.length
      : 0;

    const repeatCustomers = [...new Set(
      last30Days.filter(sale => sale.customerId).map(s => s.customerId)
    )].length;

    // Profit margin analysis
    const totalRevenue = last30Days.reduce((sum, sale) => sum + sale.total, 0);
    const totalCOGS = last30Days.reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => {
        return itemSum + (item.product.purchasePrice * item.quantity);
      }, 0);
    }, 0);
    const profitMargin = totalRevenue > 0 
      ? ((totalRevenue - totalCOGS) / totalRevenue * 100).toFixed(1)
      : 0;

    return {
      topPerformers,
      underperformers,
      revenueGrowth,
      fastMoving,
      slowMoving,
      avgOrderValue,
      repeatCustomers,
      profitMargin,
      totalRevenue,
      totalCOGS
    };
  }, [sales, products, customers]);

  // AI Predictions
  const predictions = useMemo(() => {
    // Predict next week's demand based on last 4 weeks
    const last28Days = sales.filter(sale => 
      new Date(sale.date) >= subDays(new Date(), 28)
    );

    const productDemand: Record<string, number[]> = {};
    
    // Group by week
    for (let i = 0; i < 4; i++) {
      const weekStart = subDays(new Date(), (4 - i) * 7);
      const weekEnd = subDays(new Date(), (3 - i) * 7);
      
      const weekSales = last28Days.filter(sale => {
        const date = new Date(sale.date);
        return date >= weekStart && date < weekEnd;
      });

      weekSales.forEach(sale => {
        sale.items.forEach(item => {
          if (!productDemand[item.product.id]) {
            productDemand[item.product.id] = [];
          }
          const weekIndex = i;
          if (!productDemand[item.product.id][weekIndex]) {
            productDemand[item.product.id][weekIndex] = 0;
          }
          productDemand[item.product.id][weekIndex] += item.quantity;
        });
      });
    }

    // Calculate trend and predict
    const demandPredictions = Object.entries(productDemand)
      .map(([id, weeks]) => {
        const product = products.find(p => p.id === id);
        if (!product) return null;

        const avgDemand = weeks.reduce((sum, qty) => sum + qty, 0) / weeks.length;
        const trend = weeks.length >= 2 
          ? weeks[weeks.length - 1] - weeks[0]
          : 0;
        
        const predictedDemand = Math.max(0, Math.round(avgDemand + trend));
        const currentStock = product.quantity;
        const needsReorder = predictedDemand > currentStock;

        return {
          product,
          avgDemand: Math.round(avgDemand),
          predictedDemand,
          currentStock,
          needsReorder,
          stockoutRisk: needsReorder ? ((predictedDemand - currentStock) / predictedDemand * 100).toFixed(0) : 0
        };
      })
      .filter(p => p !== null)
      .sort((a, b) => (b?.predictedDemand || 0) - (a?.predictedDemand || 0));

    return demandPredictions;
  }, [sales, products]);

  // AI Recommendations
  const recommendations = useMemo(() => {
    const recs: Array<{
      type: 'reorder' | 'price' | 'promotion' | 'stock' | 'customer';
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      action: string;
      icon: any;
      color: string;
    }> = [];

    // Reorder recommendations
    const needReorder = products.filter(p => p.quantity <= p.reorderLevel);
    if (needReorder.length > 0) {
      recs.push({
        type: 'reorder',
        priority: 'high',
        title: `${needReorder.length} Products Need Restocking`,
        description: `Critical stock levels detected. Immediate reordering recommended to avoid stockouts.`,
        action: 'View Products',
        icon: AlertCircle,
        color: 'text-red-500'
      });
    }

    // Price optimization
    const lowMarginProducts = products.filter(p => {
      const margin = ((p.sellingPrice - p.purchasePrice) / p.sellingPrice * 100);
      return margin < 20;
    });
    if (lowMarginProducts.length > 0) {
      recs.push({
        type: 'price',
        priority: 'medium',
        title: 'Price Optimization Opportunity',
        description: `${lowMarginProducts.length} products have margins below 20%. Consider price adjustments.`,
        action: 'Review Pricing',
        icon: DollarSign,
        color: 'text-yellow-500'
      });
    }

    // Slow-moving stock promotion
    if (aiInsights.slowMoving.length > 0) {
      recs.push({
        type: 'promotion',
        priority: 'medium',
        title: 'Promote Slow-Moving Items',
        description: `${aiInsights.slowMoving.length} products have low turnover. Consider running promotions.`,
        action: 'Create Promotion',
        icon: Target,
        color: 'text-blue-500'
      });
    }

    // Customer retention
    const totalCustomers = [...new Set(sales.filter(s => s.customerId).map(s => s.customerId))].length;
    if (aiInsights.repeatCustomers < totalCustomers * 0.3) {
      recs.push({
        type: 'customer',
        priority: 'high',
        title: 'Improve Customer Retention',
        description: 'Only 30% repeat customer rate. Implement loyalty programs to increase retention.',
        action: 'Setup Loyalty Program',
        icon: Users,
        color: 'text-purple-500'
      });
    }

    // Inventory optimization
    const overstock = products.filter(p => p.quantity > p.reorderLevel * 5);
    if (overstock.length > 0) {
      recs.push({
        type: 'stock',
        priority: 'low',
        title: 'Optimize Inventory Levels',
        description: `${overstock.length} products are overstocked. Consider reducing order quantities.`,
        action: 'Review Inventory',
        icon: Package,
        color: 'text-indigo-500'
      });
    }

    return recs.sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    });
  }, [products, aiInsights, sales]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden flex flex-col border-l border-gray-200 dark:border-gray-700">
      {/* Header - Clean and minimal */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Business Insights
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Analytics & Recommendations
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Tabs - Minimal styling */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors text-center ${
            activeTab === 'insights'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors text-center ${
            activeTab === 'predictions'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Forecast
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors text-center ${
            activeTab === 'recommendations'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Actions
        </button>
      </div>

      {/* Content - Professional and minimal */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {/* Revenue Card */}
            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Revenue Growth
                </h3>
                {Number(aiInsights.revenueGrowth) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className={`text-2xl font-bold ${Number(aiInsights.revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(aiInsights.revenueGrowth) >= 0 ? '+' : ''}{aiInsights.revenueGrowth}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last 7 days vs previous week
              </p>
            </div>

            {/* Profit Margin Card */}
            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Profit Margin
                </h3>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {aiInsights.profitMargin}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                30-day average
              </p>
            </div>

            {/* Top Products */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Top Selling Products
              </h3>
              <div className="space-y-2">
                {aiInsights.topPerformers.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded border border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}. {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.quantity} sold
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      LKR {(item.revenue / 1000).toFixed(1)}K
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Avg Order Value
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  LKR {(aiInsights.avgOrderValue / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Repeat Customers
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {aiInsights.repeatCustomers}
                </p>
              </div>
            </div>

            {/* Slow Moving Alert */}
            {aiInsights.slowMoving.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Slow-Moving Stock
                    </h4>
                    <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      {aiInsights.slowMoving.slice(0, 3).map((product) => (
                        <li key={product.id}>• {product.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Next Week Demand Forecast
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Based on 4-week trend analysis
              </p>
            </div>

            <div className="space-y-2">
              {predictions.slice(0, 8).map((pred) => pred && (
                <div 
                  key={pred.product.id}
                  className={`rounded-lg p-3 border ${
                    pred.needsReorder 
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                      : 'bg-gray-50 dark:bg-gray-750 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {pred.product.name}
                      </h4>
                    </div>
                    {pred.needsReorder && (
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                      <span className="block font-semibold text-gray-900 dark:text-white mt-0.5">
                        {pred.currentStock}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Forecast:</span>
                      <span className="block font-semibold text-blue-600 mt-0.5">
                        {pred.predictedDemand}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Avg:</span>
                      <span className="block font-semibold text-gray-900 dark:text-white mt-0.5">
                        {pred.avgDemand}
                      </span>
                    </div>
                  </div>

                  {pred.needsReorder && (
                    <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        ⚠ Order {pred.predictedDemand - pred.currentStock} units
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => {
                const Icon = rec.icon;
                const bgColor = rec.priority === 'high' 
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  : rec.priority === 'medium'
                  ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
                  : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800';
                
                const textColor = rec.priority === 'high' 
                  ? 'text-red-700 dark:text-red-400'
                  : rec.priority === 'medium'
                  ? 'text-yellow-700 dark:text-yellow-400'
                  : 'text-blue-700 dark:text-blue-400';

                return (
                  <div 
                    key={index}
                    className={`rounded-lg p-4 border ${bgColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 ${textColor} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {rec.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {rec.description}
                        </p>
                        <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-2">
                          {rec.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  All systems performing optimally ✓
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
