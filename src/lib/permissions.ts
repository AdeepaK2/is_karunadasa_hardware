import { UserRole, UserPermissions } from '@/types';

// Define permissions for each role
export const rolePermissions: Record<UserRole, UserPermissions> = {
  admin: {
    canViewDashboard: true,
    canManageBilling: true,
    canViewInventory: true,
    canEditInventory: true,
    canDeleteInventory: true,
    canManageCustomers: true,
    canManageEmployees: true,
    canManageSuppliers: true,
    canViewReports: true,
    canManageExpenses: true,
    canAccessSettings: true,
    canViewSales: true,
    canGiveDiscounts: true,
    canDeleteTransactions: true,
    canEditPrices: true,
  },
  manager: {
    canViewDashboard: true,
    canManageBilling: true,
    canViewInventory: true,
    canEditInventory: true,
    canDeleteInventory: false,
    canManageCustomers: true,
    canManageEmployees: false,
    canManageSuppliers: true,
    canViewReports: true,
    canManageExpenses: true,
    canAccessSettings: false,
    canViewSales: true,
    canGiveDiscounts: true,
    canDeleteTransactions: false,
    canEditPrices: false,
  },
  cashier: {
    canViewDashboard: false,
    canManageBilling: true,
    canViewInventory: true,
    canEditInventory: false,
    canDeleteInventory: false,
    canManageCustomers: true,
    canManageEmployees: false,
    canManageSuppliers: false,
    canViewReports: false,
    canManageExpenses: false,
    canAccessSettings: false,
    canViewSales: false,
    canGiveDiscounts: false,
    canDeleteTransactions: false,
    canEditPrices: false,
  },
  customer: {
    canViewDashboard: true,
    canManageBilling: false,
    canViewInventory: true,
    canEditInventory: false,
    canDeleteInventory: false,
    canManageCustomers: false,
    canManageEmployees: false,
    canManageSuppliers: false,
    canViewReports: false,
    canManageExpenses: false,
    canAccessSettings: false,
    canViewSales: false,
    canGiveDiscounts: false,
    canDeleteTransactions: false,
    canEditPrices: false,
  },
};

// Get permissions for a role
export const getPermissionsForRole = (role: UserRole): UserPermissions => {
  return rolePermissions[role];
};

// Check if user has specific permission
export const hasPermission = (
  role: UserRole,
  permission: keyof UserPermissions
): boolean => {
  return rolePermissions[role][permission];
};

// Get accessible routes for a role
export const getAccessibleRoutes = (role: UserRole) => {
  const permissions = rolePermissions[role];
  const routes = [];

  if (permissions.canViewDashboard) {
    routes.push(role === 'customer' ? '/customer-dashboard' : '/dashboard');
  }
  if (permissions.canManageBilling) routes.push('/billing');
  if (permissions.canViewInventory) routes.push('/inventory');
  if (permissions.canManageCustomers) routes.push('/customers');
  if (permissions.canManageEmployees) routes.push('/employees');
  if (permissions.canViewSales) routes.push('/sales');
  if (permissions.canManageSuppliers) routes.push('/suppliers');
  if (permissions.canManageExpenses) routes.push('/expenses');
  if (permissions.canAccessSettings) routes.push('/settings');

  return routes;
};

// Get default route for a role
export const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/dashboard';
    case 'manager':
      return '/dashboard';
    case 'cashier':
      return '/billing';
    case 'customer':
      return '/customer-dashboard';
    default:
      return '/billing';
  }
};
