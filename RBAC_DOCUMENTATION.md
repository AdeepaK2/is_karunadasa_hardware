# Role-Based Access Control (RBAC) Implementation

## Overview
The Hardware Store POS system now includes comprehensive role-based access control to provide different views and permissions for different user roles.

## User Roles

### 1. **Admin** (Full Access)
- **Access Level**: Complete system access
- **Permissions**:
  - ✅ View Dashboard with analytics
  - ✅ Manage Billing/Sales
  - ✅ View, Edit, and Delete Inventory
  - ✅ Edit product prices
  - ✅ Manage Customers
  - ✅ Manage Employees
  - ✅ Manage Suppliers
  - ✅ View all Reports and Sales
  - ✅ Manage Expenses
  - ✅ Access Settings
  - ✅ Give Discounts
  - ✅ Delete Transactions

**Default Route**: `/dashboard`

### 2. **Manager** (Operational Access)
- **Access Level**: Most operational features without system administration
- **Permissions**:
  - ✅ View Dashboard with analytics
  - ✅ Manage Billing/Sales
  - ✅ View and Edit Inventory (cannot delete)
  - ✅ Manage Customers
  - ✅ Manage Suppliers
  - ✅ View all Reports and Sales
  - ✅ Manage Expenses
  - ✅ Give Discounts
  - ❌ Cannot manage Employees
  - ❌ Cannot access Settings
  - ❌ Cannot delete transactions
  - ❌ Cannot edit prices

**Default Route**: `/dashboard`

### 3. **Cashier** (Limited Access)
- **Access Level**: Only essential billing and customer functions
- **Permissions**:
  - ✅ Manage Billing/Sales (primary function)
  - ✅ View Inventory (read-only)
  - ✅ Manage Customers
  - ❌ Cannot view Dashboard
  - ❌ Cannot edit or delete Inventory
  - ❌ Cannot manage Employees
  - ❌ Cannot manage Suppliers
  - ❌ Cannot view Sales reports
  - ❌ Cannot manage Expenses
  - ❌ Cannot access Settings
  - ❌ Cannot give discounts
  - ❌ Cannot delete transactions
  - ❌ Cannot edit prices

**Default Route**: `/billing` (goes directly to POS interface)

## Implementation Details

### File Structure
```
src/
├── lib/
│   └── permissions.ts          # Permission definitions and helpers
├── components/
│   ├── Sidebar.tsx             # Role-based menu filtering
│   └── PermissionGuard.tsx     # Component-level permission guard
├── types/
│   └── index.ts                # User and Permission types
└── contexts/
    └── AppContext.tsx          # User state and authentication
```

### Key Features

#### 1. Permission System (`src/lib/permissions.ts`)
- Defines permissions for each role
- Provides helper functions:
  - `getPermissionsForRole(role)` - Get all permissions for a role
  - `hasPermission(role, permission)` - Check specific permission
  - `getAccessibleRoutes(role)` - Get allowed routes
  - `getDefaultRoute(role)` - Get landing page based on role

#### 2. Dynamic Navigation (`src/components/Sidebar.tsx`)
- Sidebar menu automatically filters based on user permissions
- Shows only accessible menu items
- Displays user role and name at the bottom
- Different portal branding per role

#### 3. Component-Level Guards (`src/components/PermissionGuard.tsx`)
- Wraps UI elements that require permissions
- Usage example:
```tsx
<PermissionGuard permission="canEditInventory">
  <button onClick={handleEdit}>Edit</button>
</PermissionGuard>
```

#### 4. Authentication Flow
- Login page with quick login buttons for testing
- Role-based redirect after login
- User permissions stored in localStorage
- Persists across sessions

## Demo Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@hardware.com | password123 | Full |
| Manager | manager@hardware.com | password123 | Operational |
| Cashier | cashier@hardware.com | password123 | Limited |

## Permission Matrix

| Feature | Admin | Manager | Cashier |
|---------|-------|---------|---------|
| **Dashboard** | ✅ | ✅ | ❌ |
| **Billing** | ✅ | ✅ | ✅ |
| **View Inventory** | ✅ | ✅ | ✅ (Read-only) |
| **Edit Inventory** | ✅ | ✅ | ❌ |
| **Delete Inventory** | ✅ | ❌ | ❌ |
| **Edit Prices** | ✅ | ❌ | ❌ |
| **Customers** | ✅ | ✅ | ✅ |
| **Employees** | ✅ | ❌ | ❌ |
| **Sales Reports** | ✅ | ✅ | ❌ |
| **Suppliers** | ✅ | ✅ | ❌ |
| **Expenses** | ✅ | ✅ | ❌ |
| **Settings** | ✅ | ❌ | ❌ |
| **Give Discounts** | ✅ | ✅ | ❌ |
| **Delete Transactions** | ✅ | ❌ | ❌ |

## Usage Examples

### Check Permission in Code
```tsx
const { currentUser } = useApp();

if (currentUser?.permissions.canEditInventory) {
  // Show edit button
}
```

### Protect a Route Component
```tsx
import PermissionGuard from '@/components/PermissionGuard';

export default function EmployeesPage() {
  return (
    <PermissionGuard 
      permission="canManageEmployees"
      fallback={<div>Access Denied</div>}
    >
      {/* Page content */}
    </PermissionGuard>
  );
}
```

### Hide UI Element Based on Permission
```tsx
<PermissionGuard permission="canGiveDiscounts">
  <button onClick={applyDiscount}>Apply Discount</button>
</PermissionGuard>
```

## Testing the RBAC System

### Test Scenario 1: Admin User
1. Login as: `admin@hardware.com`
2. Should see: All menu items in sidebar
3. Should access: All features including Settings and Employee management
4. Can: Edit prices, delete products, manage all aspects

### Test Scenario 2: Manager User
1. Login as: `manager@hardware.com`
2. Should see: Dashboard, Billing, Inventory, Customers, Sales, Suppliers, Expenses
3. Should NOT see: Employees, Settings
4. Can: Edit inventory but not delete, cannot modify prices
5. Cannot: Access employee management or system settings

### Test Scenario 3: Cashier User
1. Login as: `cashier@hardware.com`
2. Should see: Billing, Inventory (read-only), Customers
3. Should NOT see: Dashboard, Employees, Sales, Suppliers, Expenses, Settings
4. Redirects to: `/billing` immediately after login
5. Can: Process sales, view products, manage customers
6. Cannot: Edit inventory, view reports, give discounts, access any admin features

## Future Enhancements

1. **Custom Permissions**: Allow admins to create custom roles with specific permissions
2. **Permission History**: Track permission changes and access attempts
3. **Session Management**: Add session timeout and activity tracking
4. **Audit Log**: Log all permission-restricted actions
5. **2FA**: Add two-factor authentication for admin accounts
6. **IP Restrictions**: Restrict admin access to specific IPs
7. **Time-based Access**: Permissions that vary by time of day/week

## Security Considerations

- Permissions are checked on the frontend for UI/UX purposes
- In a production app, **always validate permissions on the backend**
- Current implementation uses localStorage (suitable for demo)
- Production systems should use JWT tokens with server-side validation
- Implement API-level permission checks
- Add rate limiting for authentication attempts

## Troubleshooting

### User sees "Access Denied"
- Check if user is logged in
- Verify user role has required permission
- Clear localStorage and re-login

### Sidebar shows wrong menu items
- Check `currentUser.permissions` in browser console
- Verify permission mapping in `lib/permissions.ts`
- Ensure user data is properly loaded from storage

### Permission check always fails
- Confirm PermissionGuard component is imported
- Check spelling of permission key
- Verify currentUser exists in context
