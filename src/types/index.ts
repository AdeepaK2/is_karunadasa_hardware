// Core Types for POS System

export type UserRole = 'admin' | 'manager' | 'cashier' | 'customer';

export interface UserPermissions {
  canViewDashboard: boolean;
  canManageBilling: boolean;
  canViewInventory: boolean;
  canEditInventory: boolean;
  canDeleteInventory: boolean;
  canManageCustomers: boolean;
  canManageEmployees: boolean;
  canManageSuppliers: boolean;
  canViewReports: boolean;
  canManageExpenses: boolean;
  canAccessSettings: boolean;
  canViewSales: boolean;
  canGiveDiscounts: boolean;
  canDeleteTransactions: boolean;
  canEditPrices: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
  permissions: UserPermissions;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  reorderLevel: number;
  supplier: string;
  description?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  outstandingBalance: number;
  loyaltyPoints: number;
  createdAt: Date;
  lastPurchase?: Date;
}

export interface Employee {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  salary: number;
  joiningDate: Date;
  isActive: boolean;
  attendanceStatus: 'present' | 'absent' | 'leave';
}

export type PaymentMode = 'cash' | 'card' | 'upi' | 'credit';

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMode: PaymentMode;
  cashierId: string;
  cashierName: string;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'purchase' | 'sale' | 'return' | 'adjustment';
  quantity: number;
  date: Date;
  reference?: string;
}

export interface DashboardStats {
  todaySales: number;
  monthlySales: number;
  totalCustomers: number;
  lowStockItems: number;
  todayOrders: number;
  profitMargin: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email?: string;
  address?: string;
  products: string[];
  createdAt: Date;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  paidBy: string;
}
