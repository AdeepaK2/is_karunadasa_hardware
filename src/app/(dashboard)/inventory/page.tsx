"use client";

import React, { useState, useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import PermissionGuard from "@/components/PermissionGuard";
import ProductSalesAnalytics from "@/components/ProductSalesAnalytics";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Download,
  Upload,
  X,
  Package,
  Calendar,
  FileSpreadsheet,
  Check,
  TrendingUp,
} from "lucide-react";
import { Product, Batch } from "@/types";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface BulkUpdateRow {
  sku: string;
  productName: string;
  oldStock: number;
  newStock: number;
  oldPrice: number;
  newPrice: number;
  isValid: boolean;
  errorMessage?: string;
  isNewProduct?: boolean;
  category?: string;
  brand?: string;
  purchasePrice?: number;
  supplier?: string;
}

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct, currentUser } =
    useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    purchasePrice: 0,
    sellingPrice: 0,
    quantity: 0,
    reorderLevel: 0,
    supplier: "",
    barcode: "",
    description: "",
    trackBatches: false,
  });
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [batchFormData, setBatchFormData] = useState({
    batchNumber: "",
    quantity: 0,
    expiryDate: "",
    manufactureDate: "",
    notes: "",
  });

  // Sales Analytics State
  const [showSalesAnalytics, setShowSalesAnalytics] = useState(false);
  const [analyticsProduct, setAnalyticsProduct] = useState<Product | null>(
    null
  );

  // Bulk Update State
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState<BulkUpdateRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryValue, setNewCategoryValue] = useState("");

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filter and sort products
  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  filteredProducts = filteredProducts.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "quantity") return a.quantity - b.quantity;
    if (sortBy === "price") return a.sellingPrice - b.sellingPrice;
    return 0;
  });

  const lowStockCount = products.filter(
    (p) => p.quantity <= p.reorderLevel
  ).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  // Calculate expiry alerts
  const getExpiryStatus = (product: Product) => {
    if (
      !product.trackBatches ||
      !product.batches ||
      product.batches.length === 0
    ) {
      return null;
    }

    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    let expiredCount = 0;
    let expiringSoonCount = 0;

    product.batches.forEach((batch) => {
      if (batch.expiryDate) {
        const expiryDate = new Date(batch.expiryDate);
        if (expiryDate < now) {
          expiredCount++;
        } else if (expiryDate < thirtyDaysFromNow) {
          expiringSoonCount++;
        }
      }
    });

    return { expiredCount, expiringSoonCount };
  };

  const expiringProductsCount = products.filter((product) => {
    const status = getExpiryStatus(product);
    return status && (status.expiredCount > 0 || status.expiringSoonCount > 0);
  }).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      category: "",
      brand: "",
      purchasePrice: 0,
      sellingPrice: 0,
      quantity: 0,
      reorderLevel: 0,
      supplier: "",
      barcode: "",
      description: "",
      trackBatches: false,
    });
    setEditingProduct(null);
    setShowModal(false);
    setShowNewCategoryInput(false);
    setNewCategoryValue("");
  };

  const handleCategoryChange = (value: string) => {
    if (value === "other") {
      setShowNewCategoryInput(true);
      setFormData({ ...formData, category: "" });
    } else {
      setShowNewCategoryInput(false);
      setNewCategoryValue("");
      setFormData({ ...formData, category: value });

      // Auto-generate SKU based on category (only for new products)
      if (!editingProduct) {
        const generatedSKU = generateSKUForCategory(value);
        setFormData({ ...formData, category: value, sku: generatedSKU });
      } else {
        setFormData({ ...formData, category: value });
      }
    }
  };

  const handleNewCategoryAdd = () => {
    if (newCategoryValue.trim()) {
      const newCategory = newCategoryValue.trim();
      setFormData({ ...formData, category: newCategory });
      setShowNewCategoryInput(false);
      setNewCategoryValue("");

      // Auto-generate SKU for new category (only for new products)
      if (!editingProduct) {
        const generatedSKU = generateSKUForCategory(newCategory);
        setFormData({ ...formData, category: newCategory, sku: generatedSKU });
      }
    }
  };

  const generateSKUForCategory = (category: string): string => {
    // Generate prefix from category (first 2 letters of each word, uppercase)
    const words = category.split(" ");
    let prefix = "";

    if (words.length === 1) {
      // Single word: take first 2 letters
      prefix = category.substring(0, 2).toUpperCase();
    } else {
      // Multiple words: take first letter of each word (max 3)
      prefix = words
        .slice(0, 3)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
    }

    // Find existing products with this prefix
    const existingWithPrefix = products.filter((p) =>
      p.sku.toUpperCase().startsWith(prefix + "-")
    );

    // Extract numbers and find the highest
    let maxNumber = 0;
    existingWithPrefix.forEach((p) => {
      const match = p.sku.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });

    // Generate next number with leading zeros
    const nextNumber = (maxNumber + 1).toString().padStart(3, "0");
    return `${prefix}-${nextNumber}`;
  };

  const resetBatchForm = () => {
    setBatchFormData({
      batchNumber: "",
      quantity: 0,
      expiryDate: "",
      manufactureDate: "",
      notes: "",
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      quantity: product.quantity,
      reorderLevel: product.reorderLevel,
      supplier: product.supplier,
      barcode: product.barcode || "",
      description: product.description || "",
      trackBatches: product.trackBatches || false,
    });
    setShowModal(true);
  };

  const handleManageBatches = (product: Product) => {
    setSelectedProduct(product);
    setShowBatchModal(true);
  };

  const handleViewSalesAnalytics = (product: Product) => {
    setAnalyticsProduct(product);
    setShowSalesAnalytics(true);
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newBatch: Batch = {
      id: Date.now().toString(),
      batchNumber: batchFormData.batchNumber,
      quantity: batchFormData.quantity,
      expiryDate: batchFormData.expiryDate
        ? new Date(batchFormData.expiryDate)
        : undefined,
      manufactureDate: batchFormData.manufactureDate
        ? new Date(batchFormData.manufactureDate)
        : undefined,
      notes: batchFormData.notes,
      createdAt: new Date(),
    };

    const updatedBatches = [...(selectedProduct.batches || []), newBatch];
    const totalQuantity = updatedBatches.reduce(
      (sum, batch) => sum + batch.quantity,
      0
    );

    updateProduct(selectedProduct.id, {
      batches: updatedBatches,
      quantity: totalQuantity,
    });

    setSelectedProduct({
      ...selectedProduct,
      batches: updatedBatches,
      quantity: totalQuantity,
    });

    resetBatchForm();
  };

  const handleDeleteBatch = (batchId: string) => {
    if (
      !selectedProduct ||
      !confirm("Are you sure you want to delete this batch?")
    )
      return;

    const updatedBatches =
      selectedProduct.batches?.filter((b) => b.id !== batchId) || [];
    const totalQuantity = updatedBatches.reduce(
      (sum, batch) => sum + batch.quantity,
      0
    );

    updateProduct(selectedProduct.id, {
      batches: updatedBatches,
      quantity: totalQuantity,
    });

    setSelectedProduct({
      ...selectedProduct,
      batches: updatedBatches,
      quantity: totalQuantity,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "SKU",
      "Category",
      "Brand",
      "Purchase Price",
      "Selling Price",
      "Quantity",
      "Reorder Level",
      "Supplier",
    ];
    const rows = products.map((p) => [
      p.name,
      p.sku,
      p.category,
      p.brand,
      p.purchasePrice,
      p.sellingPrice,
      p.quantity,
      p.reorderLevel,
      p.supplier,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Bulk Update Functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      parseCSV(file);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      parseExcel(file);
    } else {
      showToastMessage("Please upload a CSV or Excel file");
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processParsedData(results.data as any[]);
      },
      error: (error) => {
        showToastMessage(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        processParsedData(jsonData as any[]);
      } catch (error) {
        showToastMessage("Error parsing Excel file");
      }
    };
    reader.readAsBinaryString(file);
  };

  const processParsedData = (data: any[]) => {
    const processedData: BulkUpdateRow[] = data.map((row) => {
      // Support multiple column name formats
      const sku =
        row.SKU ||
        row.sku ||
        row.Sku ||
        row["Product SKU"] ||
        row["product_sku"] ||
        "";
      const newStock =
        row["New Stock"] ||
        row["new_stock"] ||
        row.NewStock ||
        row.Quantity ||
        row.quantity ||
        0;
      const newPrice =
        row["New Price (LKR)"] ||
        row["New Price"] ||
        row["new_price"] ||
        row.NewPrice ||
        row.Price ||
        row.price ||
        row["Selling Price"] ||
        row["selling_price"] ||
        0;

      // Additional fields for new products
      const name =
        row["Product Name"] ||
        row.Name ||
        row.name ||
        row["product_name"] ||
        "";
      const category = row.Category || row.category || "";
      const brand = row.Brand || row.brand || "";
      const purchasePrice =
        row["Purchase Price"] ||
        row["purchase_price"] ||
        row.PurchasePrice ||
        row.Cost ||
        row.cost ||
        0;
      const supplier = row.Supplier || row.supplier || "";

      const product = products.find((p) => p.sku === sku);

      if (!product) {
        // Check if this could be a new product (has minimum required fields)
        const hasMinimumFields =
          name && category && brand && supplier && newStock > 0 && newPrice > 0;

        return {
          sku: sku || `NEW-${Date.now()}`,
          productName: name || "New Product",
          oldStock: 0,
          newStock: Number(newStock) || 0,
          oldPrice: 0,
          newPrice: Number(newPrice) || 0,
          isValid: hasMinimumFields,
          isNewProduct: true,
          category: category || "",
          brand: brand || "",
          purchasePrice: Number(purchasePrice) || 0,
          supplier: supplier || "",
          errorMessage: hasMinimumFields
            ? undefined
            : "Please complete all required fields to create this product",
        };
      }

      return {
        sku,
        productName: product.name,
        oldStock: product.quantity,
        newStock: Number(newStock),
        oldPrice: product.sellingPrice,
        newPrice: Number(newPrice),
        isValid: true,
        isNewProduct: false,
        category: product.category,
        brand: product.brand,
        supplier: product.supplier,
      };
    });

    setBulkUpdateData(processedData);
    setShowBulkUpdateModal(true);
  };

  const handleBulkUpdateEdit = (
    index: number,
    field: "newStock" | "newPrice",
    value: string
  ) => {
    const updatedData = [...bulkUpdateData];
    updatedData[index][field] = Number(value);
    setBulkUpdateData(updatedData);
  };

  const handleDeleteBulkRow = (index: number) => {
    const updatedData = bulkUpdateData.filter((_, i) => i !== index);
    setBulkUpdateData(updatedData);
    // Remove from expanded rows if it was expanded
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const toggleRowExpansion = (index: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleNewProductFieldEdit = (
    index: number,
    field: keyof BulkUpdateRow,
    value: string
  ) => {
    const updatedData = [...bulkUpdateData];
    if (field === "purchasePrice") {
      updatedData[index][field] = Number(value);
    } else if (
      field === "category" ||
      field === "brand" ||
      field === "supplier" ||
      field === "productName" ||
      field === "sku"
    ) {
      (updatedData[index][field] as any) = value;
    }

    // Revalidate the row
    const row = updatedData[index];
    const hasMinimumFields =
      row.productName &&
      row.category &&
      row.brand &&
      row.supplier &&
      row.newStock > 0 &&
      row.newPrice > 0;

    updatedData[index].isValid = !!hasMinimumFields;
    updatedData[index].errorMessage = hasMinimumFields
      ? undefined
      : "Please fill in all required fields (Name, Category, Brand, Supplier, Stock, Price)";

    setBulkUpdateData(updatedData);
  };

  const handleApproveNewProduct = (index: number) => {
    const updatedData = [...bulkUpdateData];
    const row = updatedData[index];

    // Final validation
    const isComplete =
      row.sku &&
      row.productName &&
      row.category &&
      row.brand &&
      row.supplier &&
      row.newStock > 0 &&
      row.newPrice > 0;

    if (isComplete) {
      updatedData[index].isValid = true;
      updatedData[index].errorMessage = undefined;
      setBulkUpdateData(updatedData);
      showToastMessage("New product approved and ready to create!");
    } else {
      showToastMessage("Please fill in all required fields first");
    }
  };

  const applyBulkUpdate = () => {
    setIsProcessing(true);

    const validRows = bulkUpdateData.filter((row) => row.isValid);
    const newProducts = validRows.filter((row) => row.isNewProduct);
    const existingProducts = validRows.filter((row) => !row.isNewProduct);

    // Update existing products
    existingProducts.forEach((row) => {
      const product = products.find((p) => p.sku === row.sku);
      if (product) {
        updateProduct(product.id, {
          quantity: row.newStock,
          sellingPrice: row.newPrice,
        });
      }
    });

    // Create new products
    newProducts.forEach((row) => {
      addProduct({
        name: row.productName,
        sku: row.sku,
        category: row.category || "Uncategorized",
        brand: row.brand || "Unknown",
        purchasePrice: row.purchasePrice || 0,
        sellingPrice: row.newPrice,
        quantity: row.newStock,
        reorderLevel: 10, // Default reorder level
        supplier: row.supplier || "Unknown",
        barcode: "",
        description: "Added via bulk update",
        trackBatches: false,
      });
    });

    // Store in localStorage for persistence
    try {
      const bulkUpdateLog = {
        timestamp: new Date().toISOString(),
        updatedCount: existingProducts.length,
        createdCount: newProducts.length,
        updates: existingProducts.map((row) => ({
          sku: row.sku,
          productName: row.productName,
          oldStock: row.oldStock,
          newStock: row.newStock,
          oldPrice: row.oldPrice,
          newPrice: row.newPrice,
        })),
        newProducts: newProducts.map((row) => ({
          sku: row.sku,
          productName: row.productName,
          stock: row.newStock,
          price: row.newPrice,
          category: row.category,
          brand: row.brand,
        })),
      };
      const existingLogs = JSON.parse(
        localStorage.getItem("bulkUpdateLogs") || "[]"
      );
      existingLogs.push(bulkUpdateLog);
      localStorage.setItem("bulkUpdateLogs", JSON.stringify(existingLogs));
    } catch (error) {
      console.error("Error saving bulk update log:", error);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setShowBulkUpdateModal(false);
      setBulkUpdateData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      const message =
        newProducts.length > 0
          ? `Bulk update applied successfully! ${existingProducts.length} products updated, ${newProducts.length} new products created.`
          : `Bulk update applied successfully! ${validRows.length} products updated.`;

      showToastMessage(message);
    }, 1000);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const downloadTemplate = () => {
    const headers = [
      "SKU",
      "Product Name",
      "Category",
      "Brand",
      "Old Stock",
      "New Stock",
      "Old Price (LKR)",
      "New Price (LKR)",
      "Supplier",
    ];
    const sampleRows = products
      .slice(0, 5)
      .map((p) => [
        p.sku,
        p.name,
        p.category,
        p.brand,
        p.quantity,
        p.quantity + 10,
        p.sellingPrice,
        p.sellingPrice,
        p.supplier,
      ]);

    // Add example for new product
    sampleRows.push([
      "NEW-001",
      "New Product Example",
      "Hand Tools",
      "Generic",
      "0",
      "50",
      "0",
      "150",
      "Generic Supplier",
    ]);

    const csv = [headers, ...sampleRows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-update-template.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your products and stock levels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PermissionGuard permission="canEditInventory">
            <button
              onClick={() => setShowBulkUpdateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Bulk Update
            </button>
          </PermissionGuard>
          <PermissionGuard permission="canEditInventory">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Products
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {products.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Value
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            LKR{" "}
            {products
              .reduce((sum, p) => sum + p.sellingPrice * p.quantity, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">Low Stock</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {lowStockCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-900/20">
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Out of Stock
          </p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
            {outOfStockCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/20">
          <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Expiring Soon
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {expiringProductsCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="name">Sort by Name</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="price">Sort by Price</option>
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Batch/Expiry
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => {
                const expiryStatus = getExpiryStatus(product);
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {product.supplier}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {product.sku}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {product.category}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {product.brand}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          LKR {product.sellingPrice}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Cost: LKR {product.purchasePrice}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {product.quantity}
                    </td>
                    <td className="px-4 py-4">
                      {product.trackBatches ? (
                        <div>
                          <button
                            onClick={() => handleManageBatches(product)}
                            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <Package className="w-3 h-3" />
                            {product.batches?.length || 0} Batches
                          </button>
                          {expiryStatus &&
                            (expiryStatus.expiredCount > 0 ||
                              expiryStatus.expiringSoonCount > 0) && (
                              <div className="text-xs mt-1">
                                {expiryStatus.expiredCount > 0 && (
                                  <span className="text-red-600 dark:text-red-400">
                                    {expiryStatus.expiredCount} expired
                                  </span>
                                )}
                                {expiryStatus.expiredCount > 0 &&
                                  expiryStatus.expiringSoonCount > 0 &&
                                  ", "}
                                {expiryStatus.expiringSoonCount > 0 && (
                                  <span className="text-orange-600 dark:text-orange-400">
                                    {expiryStatus.expiringSoonCount} expiring
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Not tracked
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {product.quantity === 0 ? (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                          Out of Stock
                        </span>
                      ) : product.quantity <= product.reorderLevel ? (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewSalesAnalytics(product)}
                          className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg"
                          title="View Sales History"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                        <PermissionGuard permission="canEditInventory">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission="canDeleteInventory">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product Name *
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
                    SKU *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      readOnly={!editingProduct}
                      className={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        !editingProduct
                          ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder={
                        editingProduct ? "" : "Select category first"
                      }
                    />
                    {!editingProduct && formData.category && (
                      <button
                        type="button"
                        onClick={() => {
                          const newSKU = generateSKUForCategory(
                            formData.category
                          );
                          setFormData({ ...formData, sku: newSKU });
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                        title="Regenerate SKU"
                      >
                        🔄 New
                      </button>
                    )}
                  </div>
                  {!editingProduct && formData.sku && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ Auto-generated: {formData.sku}
                    </p>
                  )}
                  {!editingProduct && !formData.category && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Select a category to auto-generate SKU
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  {!showNewCategoryInput ? (
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {categories
                        .filter((cat) => cat !== "All")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      <option value="other">➕ Add New Category</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newCategoryValue}
                        onChange={(e) => setNewCategoryValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleNewCategoryAdd();
                          }
                        }}
                        placeholder="Enter new category name"
                        className="flex-1 px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleNewCategoryAdd}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        title="Add category"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryInput(false);
                          setNewCategoryValue("");
                        }}
                        className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                        title="Cancel"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {formData.category && !showNewCategoryInput && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Selected: {formData.category}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Price *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.purchasePrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchasePrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.sellingPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sellingPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.quantity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reorder Level *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.reorderLevel || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reorderLevel: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.supplier}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trackBatches"
                  checked={formData.trackBatches}
                  onChange={(e) =>
                    setFormData({ ...formData, trackBatches: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="trackBatches"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Enable Batch & Expiry Tracking (for chemicals, paints, etc.)
                </label>
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
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Management Modal */}
      {showBatchModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Batch Management - {selectedProduct.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  SKU: {selectedProduct.sku} | Total Stock:{" "}
                  {selectedProduct.quantity}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBatchModal(false);
                  setSelectedProduct(null);
                  resetBatchForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Add New Batch Form */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Add New Batch
                </h4>
                <form onSubmit={handleAddBatch} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Batch Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={batchFormData.batchNumber}
                        onChange={(e) =>
                          setBatchFormData({
                            ...batchFormData,
                            batchNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., BATCH-2025-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={batchFormData.quantity || ""}
                        onChange={(e) =>
                          setBatchFormData({
                            ...batchFormData,
                            quantity: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Manufacture Date
                      </label>
                      <input
                        type="date"
                        value={batchFormData.manufactureDate}
                        onChange={(e) =>
                          setBatchFormData({
                            ...batchFormData,
                            manufactureDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        value={batchFormData.expiryDate}
                        onChange={(e) =>
                          setBatchFormData({
                            ...batchFormData,
                            expiryDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={batchFormData.notes}
                      onChange={(e) =>
                        setBatchFormData({
                          ...batchFormData,
                          notes: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Additional information about this batch"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Add Batch
                  </button>
                </form>
              </div>

              {/* Existing Batches */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Existing Batches ({selectedProduct.batches?.length || 0})
                </h4>
                {selectedProduct.batches &&
                selectedProduct.batches.length > 0 ? (
                  <div className="space-y-3">
                    {selectedProduct.batches.map((batch) => {
                      const now = new Date();
                      const expiryDate = batch.expiryDate
                        ? new Date(batch.expiryDate)
                        : null;
                      const isExpired = expiryDate && expiryDate < now;
                      const isExpiringSoon =
                        expiryDate &&
                        !isExpired &&
                        expiryDate <
                          new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                      const daysUntilExpiry = expiryDate
                        ? Math.ceil(
                            (expiryDate.getTime() - now.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : null;

                      return (
                        <div
                          key={batch.id}
                          className={`border rounded-lg p-4 ${
                            isExpired
                              ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                              : isExpiringSoon
                              ? "border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Batch Number
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {batch.batchNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Quantity
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {batch.quantity} units
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Manufacture Date
                                </p>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {batch.manufactureDate
                                    ? new Date(
                                        batch.manufactureDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Expiry Date
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-gray-900 dark:text-white">
                                    {batch.expiryDate
                                      ? new Date(
                                          batch.expiryDate
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </p>
                                  {isExpired && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                                      Expired
                                    </span>
                                  )}
                                  {isExpiringSoon &&
                                    daysUntilExpiry !== null && (
                                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded-full">
                                        {daysUntilExpiry}d left
                                      </span>
                                    )}
                                </div>
                              </div>
                              {batch.notes && (
                                <div className="col-span-2">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Notes
                                  </p>
                                  <p className="text-sm text-gray-900 dark:text-white">
                                    {batch.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                            <PermissionGuard permission="canDeleteInventory">
                              <button
                                onClick={() => handleDeleteBatch(batch.id)}
                                className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                title="Delete batch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </PermissionGuard>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No batches added yet</p>
                    <p className="text-sm">
                      Add your first batch using the form above
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bulk Update Products
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Upload a CSV or Excel file to update multiple products at once
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBulkUpdateModal(false);
                  setBulkUpdateData([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload Section */}
              {bulkUpdateData.length === 0 ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                    <div className="text-center">
                      <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Upload Bulk Update File
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Supported formats: CSV, XLS, XLSX
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="bulk-upload-input"
                      />
                      <label
                        htmlFor="bulk-upload-input"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium"
                      >
                        <Upload className="w-5 h-5" />
                        Choose File
                      </label>
                    </div>
                  </div>

                  {/* Template Download & Instructions */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      📋 File Format Instructions
                    </h5>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 mb-3">
                      <li>
                        <strong>Update Existing Products:</strong> Only{" "}
                        <strong>SKU</strong>, <strong>New Stock</strong>,{" "}
                        <strong>New Price</strong> are required
                      </li>
                      <li>
                        <strong>Create New Products:</strong> Also include{" "}
                        <strong>Name</strong>, <strong>Category</strong>,{" "}
                        <strong>Brand</strong>, <strong>Supplier</strong>
                      </li>
                      <li>
                        • Optional: <strong>Purchase Price</strong> (defaults to
                        70% of selling price)
                      </li>
                      <li>• All numeric values must be valid numbers</li>
                      <li>
                        • Download the template to see the correct format with
                        examples
                      </li>
                    </ul>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download CSV Template (with new product example)
                    </button>
                  </div>
                </div>
              ) : (
                /* Preview Table */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Preview Changes ({bulkUpdateData.length} rows)
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Review and edit the data before applying changes
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setBulkUpdateData([]);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Upload Different File
                    </button>
                  </div>

                  {/* Validation Summary */}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {
                          bulkUpdateData.filter(
                            (row) => row.isValid && !row.isNewProduct
                          ).length
                        }{" "}
                        Updates
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {
                          bulkUpdateData.filter(
                            (row) => row.isValid && row.isNewProduct
                          ).length
                        }{" "}
                        New Products
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {bulkUpdateData.filter((row) => !row.isValid).length}{" "}
                        Errors
                      </span>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                              SKU
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                              Product Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                              Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                              Brand
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                              Supplier
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                              Stock
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                              Price
                            </th>
                            {(currentUser?.role === "admin" ||
                              currentUser?.role === "manager") && (
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {bulkUpdateData.map((row, index) => (
                            <tr
                              key={index}
                              className={`${
                                row.isNewProduct
                                  ? row.isValid
                                    ? "bg-green-50 dark:bg-green-900/20"
                                    : "bg-yellow-50 dark:bg-yellow-900/20"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                            >
                              {/* Status Icon */}
                              <td className="px-4 py-3">
                                {row.isNewProduct ? (
                                  row.isValid ? (
                                    <div className="flex items-center gap-1">
                                      <Check className="w-5 h-5 text-green-600" />
                                      <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                                        NEW
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      className="flex items-center gap-1"
                                      title="New product - needs approval"
                                    >
                                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                      <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                                        NEW
                                      </span>
                                    </div>
                                  )
                                ) : (
                                  <Check className="w-5 h-5 text-green-600" />
                                )}
                              </td>

                              {/* SKU */}
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                {row.isNewProduct ? (
                                  <input
                                    type="text"
                                    value={row.sku}
                                    onChange={(e) =>
                                      handleNewProductFieldEdit(
                                        index,
                                        "sku",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 text-sm border border-yellow-300 dark:border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="SKU"
                                  />
                                ) : (
                                  row.sku
                                )}
                              </td>

                              {/* Product Name */}
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {row.isNewProduct ? (
                                  <input
                                    type="text"
                                    value={row.productName}
                                    onChange={(e) =>
                                      handleNewProductFieldEdit(
                                        index,
                                        "productName",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 text-sm border border-yellow-300 dark:border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Product Name *"
                                  />
                                ) : (
                                  row.productName
                                )}
                              </td>

                              {/* Category */}
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {row.isNewProduct ? (
                                  <select
                                    value={row.category || ""}
                                    onChange={(e) =>
                                      handleNewProductFieldEdit(
                                        index,
                                        "category",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 text-sm border border-yellow-300 dark:border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                                  >
                                    <option value="">Select Category *</option>
                                    {categories
                                      .filter((c) => c !== "All")
                                      .map((cat) => (
                                        <option key={cat} value={cat}>
                                          {cat}
                                        </option>
                                      ))}
                                  </select>
                                ) : (
                                  row.category || "-"
                                )}
                              </td>

                              {/* Brand */}
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {row.isNewProduct ? (
                                  <input
                                    type="text"
                                    value={row.brand || ""}
                                    onChange={(e) =>
                                      handleNewProductFieldEdit(
                                        index,
                                        "brand",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 text-sm border border-yellow-300 dark:border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Brand *"
                                  />
                                ) : (
                                  row.brand || "-"
                                )}
                              </td>

                              {/* Supplier */}
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {row.isNewProduct ? (
                                  <input
                                    type="text"
                                    value={row.supplier || ""}
                                    onChange={(e) =>
                                      handleNewProductFieldEdit(
                                        index,
                                        "supplier",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 text-sm border border-yellow-300 dark:border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Supplier *"
                                  />
                                ) : (
                                  row.supplier || "-"
                                )}
                              </td>

                              {/* Stock */}
                              <td className="px-4 py-3 text-right">
                                <input
                                  type="number"
                                  value={row.newStock}
                                  onChange={(e) =>
                                    row.isNewProduct
                                      ? handleNewProductFieldEdit(
                                          index,
                                          "newStock",
                                          e.target.value
                                        )
                                      : handleBulkUpdateEdit(
                                          index,
                                          "newStock",
                                          e.target.value
                                        )
                                  }
                                  className={`w-24 px-2 py-1 text-sm text-right border ${
                                    row.isNewProduct
                                      ? "border-yellow-300 dark:border-yellow-600"
                                      : "border-gray-300 dark:border-gray-600"
                                  } rounded focus:outline-none focus:ring-2 ${
                                    row.isNewProduct
                                      ? "focus:ring-yellow-500"
                                      : "focus:ring-blue-500"
                                  } dark:bg-gray-700 dark:text-white`}
                                  min="0"
                                  placeholder={row.isNewProduct ? "Qty *" : ""}
                                />
                                {!row.isNewProduct && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Was: {row.oldStock}
                                  </div>
                                )}
                              </td>

                              {/* Price */}
                              <td className="px-4 py-3 text-right">
                                <input
                                  type="number"
                                  value={row.newPrice}
                                  onChange={(e) =>
                                    row.isNewProduct
                                      ? handleNewProductFieldEdit(
                                          index,
                                          "newPrice",
                                          e.target.value
                                        )
                                      : handleBulkUpdateEdit(
                                          index,
                                          "newPrice",
                                          e.target.value
                                        )
                                  }
                                  className={`w-32 px-2 py-1 text-sm text-right border ${
                                    row.isNewProduct
                                      ? "border-yellow-300 dark:border-yellow-600"
                                      : "border-gray-300 dark:border-gray-600"
                                  } rounded focus:outline-none focus:ring-2 ${
                                    row.isNewProduct
                                      ? "focus:ring-yellow-500"
                                      : "focus:ring-blue-500"
                                  } dark:bg-gray-700 dark:text-white`}
                                  min="0"
                                  step="0.01"
                                  placeholder={
                                    row.isNewProduct ? "Price *" : ""
                                  }
                                />
                                {!row.isNewProduct && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Was: LKR {row.oldPrice.toFixed(2)}
                                  </div>
                                )}
                              </td>

                              {/* Actions */}
                              {(currentUser?.role === "admin" ||
                                currentUser?.role === "manager") && (
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-center gap-2">
                                    {row.isNewProduct && !row.isValid && (
                                      <button
                                        onClick={() =>
                                          handleApproveNewProduct(index)
                                        }
                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                        title="Approve new product"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteBulkRow(index)}
                                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                      title="Remove row"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bulkUpdateData.filter((row) => row.isValid).length}{" "}
                      products will be updated
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowBulkUpdateModal(false);
                          setBulkUpdateData([]);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={applyBulkUpdate}
                        disabled={
                          isProcessing ||
                          bulkUpdateData.filter((row) => row.isValid).length ===
                            0
                        }
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Apply Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sales Analytics Modal */}
      {showSalesAnalytics && analyticsProduct && (
        <ProductSalesAnalytics
          product={analyticsProduct}
          onClose={() => {
            setShowSalesAnalytics(false);
            setAnalyticsProduct(null);
          }}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <Check className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
