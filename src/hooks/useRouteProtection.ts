import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { getDefaultRoute } from '@/lib/permissions';

// Map routes to required permissions
const routePermissions: Record<string, keyof import('@/types').UserPermissions> = {
  '/dashboard': 'canViewDashboard',
  '/billing': 'canManageBilling',
  '/inventory': 'canViewInventory',
  '/customers': 'canManageCustomers',
  '/employees': 'canManageEmployees',
  '/sales': 'canViewSales',
  '/suppliers': 'canManageSuppliers',
  '/expenses': 'canManageExpenses',
  '/settings': 'canAccessSettings',
};

export function useRouteProtection() {
  const { currentUser } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Check if current route requires specific permission
    const requiredPermission = routePermissions[pathname];
    
    if (requiredPermission && !currentUser.permissions?.[requiredPermission]) {
      // Redirect to default route for user's role
      const defaultRoute = getDefaultRoute(currentUser.role);
      router.push(defaultRoute);
    }
  }, [currentUser, pathname, router]);

  return {
    hasAccess: currentUser && 
      (!routePermissions[pathname] || currentUser.permissions?.[routePermissions[pathname]]),
    currentUser,
  };
}
