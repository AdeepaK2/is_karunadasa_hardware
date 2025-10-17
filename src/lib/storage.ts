// Local Storage utility functions for frontend-only persistence

const STORAGE_KEYS = {
  PRODUCTS: 'pos_products',
  CUSTOMERS: 'pos_customers',
  EMPLOYEES: 'pos_employees',
  SALES: 'pos_sales',
  SUPPLIERS: 'pos_suppliers',
  EXPENSES: 'pos_expenses',
  USERS: 'pos_users',
  CURRENT_USER: 'pos_current_user',
  THEME: 'pos_theme',
} as const;

export const storage = {
  // Generic get/set
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Specific storage functions
  getProducts: () => storage.get(STORAGE_KEYS.PRODUCTS),
  setProducts: (products: any) => storage.set(STORAGE_KEYS.PRODUCTS, products),

  getCustomers: () => storage.get(STORAGE_KEYS.CUSTOMERS),
  setCustomers: (customers: any) => storage.set(STORAGE_KEYS.CUSTOMERS, customers),

  getEmployees: () => storage.get(STORAGE_KEYS.EMPLOYEES),
  setEmployees: (employees: any) => storage.set(STORAGE_KEYS.EMPLOYEES, employees),

  getSales: () => storage.get(STORAGE_KEYS.SALES),
  setSales: (sales: any) => storage.set(STORAGE_KEYS.SALES, sales),

  getSuppliers: () => storage.get(STORAGE_KEYS.SUPPLIERS),
  setSuppliers: (suppliers: any) => storage.set(STORAGE_KEYS.SUPPLIERS, suppliers),

  getExpenses: () => storage.get(STORAGE_KEYS.EXPENSES),
  setExpenses: (expenses: any) => storage.set(STORAGE_KEYS.EXPENSES, expenses),

  getUsers: () => storage.get(STORAGE_KEYS.USERS),
  setUsers: (users: any) => storage.set(STORAGE_KEYS.USERS, users),

  getCurrentUser: () => storage.get(STORAGE_KEYS.CURRENT_USER),
  setCurrentUser: (user: any) => storage.set(STORAGE_KEYS.CURRENT_USER, user),

  getTheme: () => storage.get(STORAGE_KEYS.THEME),
  setTheme: (theme: string) => storage.set(STORAGE_KEYS.THEME, theme),
};

export default storage;
