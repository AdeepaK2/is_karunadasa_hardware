'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { mockProducts } from '@/lib/mockData';
import { Product } from '@/types';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  // Update product image URLs to use the correct path
  const products = mockProducts.map(product => ({
    ...product,
    imageUrl: `/${product.id}.png` // Use the product ID to map to 1.png, 2.png, etc.
  }));

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(product => product.category)))];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.sellingPrice - b.sellingPrice;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const addToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product.name);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">Browse our complete range of hardware products</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
              <option value="brand">Brand</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
              <Image
                src={product.imageUrl || '/placeholder-product.png'}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.png';
                }}
              />
              
              {/* Stock Status Badge */}
              <div className="absolute top-2 right-2">
                {product.quantity > product.reorderLevel ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    In Stock
                  </span>
                ) : product.quantity > 0 ? (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    Low Stock
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Category and Brand */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  {product.category}
                </span>
                <span className="text-xs text-gray-500">{product.brand}</span>
              </div>

              {/* Product Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* SKU */}
              <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>

              {/* Price and Stock */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    LKR {product.sellingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Stock: {product.quantity}</p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                disabled={product.quantity === 0}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                  product.quantity === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Products Found */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-4m-8 0H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse different categories.</p>
        </div>
      )}

      {/* Products Count */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
