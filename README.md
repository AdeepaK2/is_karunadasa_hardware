# Karunadasa Hardware - Point of Sale System

A modern, full-featured Point of Sale (POS) system built with Next.js, TypeScript, and Tailwind CSS for hardware store management.

## Features

### 🎯 Multi-Role Access Control
- **Admin**: Full system access with management capabilities
- **Manager**: Operational access with view and ordering permissions
- **Cashier**: Billing and sales operations
- **Customer**: Product browsing and order management

### 📊 Dashboard & Analytics
- Real-time revenue tracking (24-hour and monthly)
- Profit margin calculations
- Sales analytics and trends
- Product performance metrics
- Monthly attendance tracking

### 💰 Billing & Sales
- Quick product search and billing
- Multiple payment modes (Cash, Card, UPI, Credit)
- Invoice generation with unique invoice numbers
- Discount management with permission controls
- Real-time stock updates

### 📦 Inventory Management
- Product catalog with categories
- Stock level monitoring
- Low stock alerts
- Product CRUD operations (role-based)
- SKU and barcode support

### 👥 Customer Management
- Customer database with contact details
- Loyalty points system (1 point per Rs.100)
- Credit limit tracking
- Outstanding balance management
- Purchase history

### 👨‍💼 Employee Management
- Employee records with role assignments
- Contact information management
- Hire date tracking
- Salary information

### 🚚 Supplier Management
- Supplier database
- Contact and address management
- Product supply tracking
- Order placement (Manager role)
- Supplier CRUD operations (Admin role)

### 💵 Expense Tracking
- Expense categorization
- Date-based filtering
- Monthly expense reports
- Budget analysis

### 🎨 Theme Support
- Light and Dark mode
- Automatic OS theme detection
- Persistent theme preference
- Smooth transitions

### 🔒 Security Features
- Role-based access control (RBAC)
- Permission-based UI rendering
- Secure route protection
- Session management

## Tech Stack

- **Framework**: Next.js 14.2.20 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: LocalStorage (with mock data fallback)
- **Code Quality**: Biome.js (linter + formatter)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AdeepaK2/is_karunadasa_hardware.git
cd is_karunadasa_hardware
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Default User Credentials

### Admin
- **Email**: admin@hardware.com
- **Password**: admin123
- **Access**: Full system control

### Manager
- **Email**: manager@hardware.com
- **Password**: manager123
- **Access**: Dashboard, Inventory (view), Customers, Sales, Suppliers (view/order), Expenses

### Cashier
- **Email**: cashier@hardware.com
- **Password**: cashier123
- **Access**: Billing, Inventory (view), Customers

### Customer
- **Email**: customer@hardware.com
- **Password**: customer123
- **Access**: Product browsing, Cart, Orders, Profile

## Project Structure

```
├── src/
│   ├── app/                      # Next.js app router pages
│   │   ├── (dashboard)/          # Admin/Manager/Cashier dashboard routes
│   │   │   ├── billing/
│   │   │   ├── customers/
│   │   │   ├── dashboard/
│   │   │   ├── employees/
│   │   │   ├── expenses/
│   │   │   ├── inventory/
│   │   │   ├── sales/
│   │   │   ├── settings/
│   │   │   └── suppliers/
│   │   ├── customer-dashboard/   # Customer portal routes
│   │   ├── login/
│   │   └── register/
│   ├── components/               # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── CustomerHeader.tsx
│   │   ├── CustomerSidebar.tsx
│   │   ├── PermissionGuard.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── landing/              # Landing page components
│   ├── contexts/                 # React Context providers
│   │   └── AppContext.tsx
│   ├── hooks/                    # Custom React hooks
│   │   └── useRouteProtection.ts
│   ├── lib/                      # Utility functions and data
│   │   ├── creditLimit.ts
│   │   ├── loyaltyProgram.ts
│   │   ├── mockData.ts
│   │   ├── permissions.ts
│   │   └── storage.ts
│   └── types/                    # TypeScript type definitions
│       └── index.ts
├── public/                       # Static assets
├── biome.json                    # Biome configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Key Features Explained

### Permission System
The application uses a comprehensive role-based permission system defined in `src/lib/permissions.ts`:

```typescript
- canViewDashboard
- canManageBilling
- canViewInventory
- canEditInventory
- canDeleteInventory
- canManageCustomers
- canManageEmployees
- canManageSuppliers
- canViewReports
- canManageExpenses
- canAccessSettings
- canViewSales
- canGiveDiscounts
- canDeleteTransactions
- canEditPrices
```

### Loyalty Program
- Customers earn 1 point per Rs.100 spent
- Points can be redeemed for discounts
- Automatic point calculation on purchases
- Tier-based benefits (configurable)

### Credit Management
- Credit limit per customer
- Outstanding balance tracking
- Credit payment mode support
- Automatic balance updates

### Data Persistence
- LocalStorage for data persistence
- Mock data fallback for first-time users
- Real-time synchronization
- Export/Import capabilities (coming soon)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
```

## Role-Based Access

### Admin
- ✅ Dashboard, Inventory (full), Customers, Employees, Sales, Suppliers (full), Expenses, Settings
- ❌ Billing

### Manager
- ✅ Dashboard, Inventory (view), Customers, Sales, Suppliers (view/order), Expenses
- ❌ Billing, Employees, Settings, Edit/Delete operations

### Cashier
- ✅ Billing, Inventory (view), Customers
- ❌ Dashboard, Employees, Sales, Suppliers, Expenses, Settings

### Customer
- ✅ Product browsing, Cart, Orders, Profile
- ❌ All admin/staff features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@karunadasahardware.com or open an issue in the GitHub repository.

## Roadmap

- [ ] Invoice PDF generation
- [ ] Data export (CSV/Excel)
- [ ] Barcode scanning integration
- [ ] Email notifications
- [ ] SMS alerts for low stock
- [ ] Advanced reporting dashboard
- [ ] Multi-store support
- [ ] API integration for payment gateways
- [ ] Mobile app (React Native)
- [ ] Backup and restore functionality

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for beautiful icons
- Vercel for hosting solutions

---

**Built with ❤️ for Karunadasa Hardware**
