"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Product,
  Customer,
  Employee,
  Sale,
  Supplier,
  Expense,
  User,
  CartItem,
} from "@/types";
import { storage } from "@/lib/storage";
import {
  mockProducts,
  mockCustomers,
  mockEmployees,
  mockSales,
  mockSuppliers,
  mockExpenses,
  mockUsers,
} from "@/lib/mockData";
import { getDefaultRoute } from "@/lib/permissions";
import { calculateLoyaltyPoints } from "@/lib/loyaltyProgram";

interface AppContextType {
  // Data
  products: Product[];
  customers: Customer[];
  employees: Employee[];
  sales: Sale[];
  suppliers: Supplier[];
  expenses: Expense[];
  users: User[];
  currentUser: User | null;
  cart: CartItem[];
  theme: "light" | "dark";

  // Products
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Customers
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Employees
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Sales
  addSale: (sale: Omit<Sale, "id" | "invoiceNumber" | "date">) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;

  // Suppliers
  addSupplier: (supplier: Omit<Supplier, "id" | "createdAt">) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Expenses
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Cart
  addToCart: (product: Product, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyDiscount: (productId: string, discount: number) => void;

  // Auth
  login: (user: User) => void;
  logout: () => void;

  // Theme
  toggleTheme: () => void;

  // Initialize data
  initializeData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data from localStorage or use mock data
  const initializeData = () => {
    const storedProducts = storage.getProducts();
    const storedCustomers = storage.getCustomers();
    const storedEmployees = storage.getEmployees();
    const storedSales = storage.getSales();
    const storedSuppliers = storage.getSuppliers();
    const storedExpenses = storage.getExpenses();
    const storedUsers = storage.getUsers();
    const storedTheme = storage.getTheme();

    setProducts(Array.isArray(storedProducts) ? storedProducts : mockProducts);
    setCustomers(
      Array.isArray(storedCustomers) ? storedCustomers : mockCustomers
    );
    setEmployees(
      Array.isArray(storedEmployees) ? storedEmployees : mockEmployees
    );
    setSales(Array.isArray(storedSales) ? storedSales : mockSales);
    setSuppliers(
      Array.isArray(storedSuppliers) ? storedSuppliers : mockSuppliers
    );
    setExpenses(Array.isArray(storedExpenses) ? storedExpenses : mockExpenses);
    setUsers(Array.isArray(storedUsers) ? storedUsers : mockUsers);
    setTheme(
      storedTheme === "light" || storedTheme === "dark" ? storedTheme : "light"
    );
    setIsInitialized(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeData();
      const storedUser = storage.getCurrentUser();
      if (storedUser && typeof storedUser === "object" && "id" in storedUser) {
        // Ensure the user has permissions
        const userWithPermissions = storedUser as User;
        if (!userWithPermissions.permissions) {
          // If permissions are missing, add them based on role
          const { getPermissionsForRole } = require("@/lib/permissions");
          userWithPermissions.permissions = getPermissionsForRole(
            userWithPermissions.role
          );
        }
        setCurrentUser(userWithPermissions);
      }

      // Initialize theme: Check localStorage first, then OS preference
      const storedTheme = storage.getTheme();
      let initialTheme: "light" | "dark";

      if (storedTheme === "light" || storedTheme === "dark") {
        initialTheme = storedTheme;
      } else {
        // Detect OS theme preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        initialTheme = prefersDark ? "dark" : "light";
      }

      setTheme(initialTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(initialTheme);

      // Listen for OS theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleThemeChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if user hasn't explicitly set a preference
        if (!storage.getTheme()) {
          const newTheme = e.matches ? "dark" : "light";
          setTheme(newTheme);
        }
      };

      mediaQuery.addEventListener("change", handleThemeChange);
      return () => mediaQuery.removeEventListener("change", handleThemeChange);
    }
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    if (isInitialized) {
      storage.setProducts(products);
    }
  }, [products, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      storage.setCustomers(customers);
    }
  }, [customers, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      storage.setEmployees(employees);
    }
  }, [employees, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      storage.setSales(sales);
    }
  }, [sales, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      storage.setSuppliers(suppliers);
    }
  }, [suppliers, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      storage.setExpenses(expenses);
    }
  }, [expenses, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      storage.setUsers(users);
    }
  }, [users, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      storage.setTheme(theme);
      console.log("🎨 Theme changing to:", theme);
      // Remove both classes first
      document.documentElement.classList.remove("light", "dark");
      // Add the current theme
      document.documentElement.classList.add(theme);
      console.log(
        "📋 HTML classList:",
        document.documentElement.classList.toString()
      );
      console.log(
        "🎯 HTML has .light:",
        document.documentElement.classList.contains("light")
      );
      console.log(
        "🌙 HTML has .dark:",
        document.documentElement.classList.contains("dark")
      );
    }
  }, [theme, isInitialized]);

  // Product functions
  const addProduct = (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, ...updatedProduct, updatedAt: new Date() } : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Customer functions
  const addCustomer = (customer: Omit<Customer, "id" | "createdAt">) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: string, updatedCustomer: Partial<Customer>) => {
    setCustomers(
      customers.map((c) => (c.id === id ? { ...c, ...updatedCustomer } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  // Employee functions
  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, updatedEmployee: Partial<Employee>) => {
    setEmployees(
      employees.map((e) => (e.id === id ? { ...e, ...updatedEmployee } : e))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  // Sale functions
  const addSale = (sale: Omit<Sale, "id" | "invoiceNumber" | "date">) => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(
      sales.length + 1
    ).padStart(4, "0")}`;
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      invoiceNumber,
      date: new Date(),
    };

    // Update product quantities
    sale.items.forEach((item) => {
      updateProduct(item.product.id, {
        quantity: item.product.quantity - item.quantity,
      });
    });

    // Calculate and award loyalty points (1 point per Rs.100 spent)
    if (sale.customerId) {
      const pointsEarned = calculateLoyaltyPoints(sale.total);
      const customer = customers.find((c) => c.id === sale.customerId);

      if (customer && pointsEarned > 0) {
        const updates: Partial<Customer> = {
          loyaltyPoints: customer.loyaltyPoints + pointsEarned,
          lastPurchase: new Date(),
        };

        // If payment mode is credit, add to outstanding balance
        if (sale.paymentMode === "credit") {
          updates.outstandingBalance = customer.outstandingBalance + sale.total;
        }

        updateCustomer(sale.customerId, updates);
      } else if (customer) {
        const updates: Partial<Customer> = {
          lastPurchase: new Date(),
        };

        // If payment mode is credit, add to outstanding balance
        if (sale.paymentMode === "credit") {
          updates.outstandingBalance = customer.outstandingBalance + sale.total;
        }

        updateCustomer(sale.customerId, updates);
      }
    }

    setSales([...sales, newSale]);
  };

  const updateSale = (id: string, updatedSale: Partial<Sale>) => {
    setSales(sales.map((s) => (s.id === id ? { ...s, ...updatedSale } : s)));
  };

  // Supplier functions
  const addSupplier = (supplier: Omit<Supplier, "id" | "createdAt">) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateSupplier = (id: string, updatedSupplier: Partial<Supplier>) => {
    setSuppliers(
      suppliers.map((s) => (s.id === id ? { ...s, ...updatedSupplier } : s))
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  // Expense functions
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(
      expenses.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Cart functions
  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity, discount: 0 }]);
    }
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyDiscount = (productId: string, discount: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, discount } : item
      )
    );
  };

  // Auth functions
  const login = (user: User) => {
    setCurrentUser(user);
    storage.setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    storage.remove("pos_current_user");
    setCart([]);
  };

  // Theme function
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        customers,
        employees,
        sales,
        suppliers,
        expenses,
        users,
        currentUser,
        cart,
        theme,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addSale,
        updateSale,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addExpense,
        updateExpense,
        deleteExpense,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        applyDiscount,
        login,
        logout,
        toggleTheme,
        initializeData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
