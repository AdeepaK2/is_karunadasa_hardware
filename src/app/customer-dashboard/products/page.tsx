'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  Filter,
  Star,
} from 'lucide-react';

export default function ProductsPage() {
  const { products, addToCart, cart } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ['all', ...cats];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.sellingPrice - b.sellingPrice;
        case 'price-high':
          return b.sellingPrice - a.sellingPrice;
        case 'stock':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Get cart quantity for a product
  const getCartQuantity = (productId: string) => {
    const cartItem = cart.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle add to cart
  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  // Handle quantity change
  const handleQuantityChange = (product: any, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove from cart if quantity is 0 or less
      const cartItem = cart.find(item => item.product.id === product.id);
      if (cartItem) {
        // We need to remove the item - this would require a removeFromCart function
        // For now, we'll just not add it
      }
    } else {
      addToCart(product, newQuantity - getCartQuantity(product.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Browse our complete catalog of hardware and building materials.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-9 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const cartQuantity = getCartQuantity(product.id);
          const isLowStock = product.quantity <= product.reorderLevel;
          const isOutOfStock = product.quantity <= 0;

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-8">
                <Package className="w-16 h-16 text-gray-400" />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                    {product.name}
                  </h3>
                  {isLowStock && !isOutOfStock && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      Low Stock
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      Out of Stock
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  SKU: {product.sku}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    ₹{product.sellingPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {product.quantity} in stock
                  </span>
                </div>

                {/* Add to Cart */}
                {cartQuantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(product, cartQuantity - 1)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-medium text-gray-900 dark:text-white">
                      {cartQuantity} in cart
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product, cartQuantity + 1)}
                      className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                      disabled={cartQuantity >= product.quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                      isOutOfStock
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}