import {
  Product,
  Customer,
  Employee,
  Sale,
  Supplier,
  Expense,
  User,
} from "@/types";
import { getPermissionsForRole } from "./permissions";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWeekend,
} from "date-fns";

// Mock Users with permissions
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@hardware.com",
    role: "admin",
    phone: "+1234567890",
    createdAt: new Date("2024-01-01"),
    permissions: getPermissionsForRole("admin"),
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@hardware.com",
    role: "manager",
    phone: "+1234567891",
    createdAt: new Date("2024-01-01"),
    permissions: getPermissionsForRole("manager"),
  },
  {
    id: "3",
    name: "Cashier User",
    email: "cashier@hardware.com",
    role: "cashier",
    phone: "+1234567892",
    createdAt: new Date("2024-01-01"),
    permissions: getPermissionsForRole("cashier"),
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Hammer",
    sku: "HW-001",
    category: "Hand Tools",
    brand: "Stanley",
    purchasePrice: 150,
    sellingPrice: 250,
    quantity: 45,
    reorderLevel: 10,
    supplier: 'Tools Wholesale',
    barcode: '1234567890123',
    description: 'Professional claw hammer with fiberglass handle',
    imageUrl: '/products/8.png',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "2",
    name: "Screwdriver Set",
    sku: "HW-002",
    category: "Hand Tools",
    brand: "Bosch",
    purchasePrice: 300,
    sellingPrice: 450,
    quantity: 30,
    reorderLevel: 15,
    supplier: 'Tools Wholesale',
    barcode: '1234567890124',
    description: 'Complete screwdriver set with various sizes and types',
    imageUrl: '/products/7.png',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "3",
    name: "Electric Drill",
    sku: "PW-001",
    category: "Power Tools",
    brand: "DeWalt",
    purchasePrice: 3500,
    sellingPrice: 5200,
    quantity: 8,
    reorderLevel: 5,
    supplier: 'Power Tools Inc',
    barcode: '1234567890125',
    description: 'Cordless electric drill with variable speed control',
    imageUrl: '/products/6.png',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "4",
    name: 'Paint Brush 2"',
    sku: "PT-001",
    category: "Painting",
    brand: "Asian Paints",
    purchasePrice: 50,
    sellingPrice: 85,
    quantity: 120,
    reorderLevel: 30,
    supplier: 'Paint Supplies Co',
    barcode: '1234567890126',
    description: 'Professional paint brush for all types of paint',
    imageUrl: '/products/5.png',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "5",
    name: "LED Bulb 9W",
    sku: "EL-001",
    category: "Electrical",
    brand: "Philips",
    purchasePrice: 80,
    sellingPrice: 120,
    quantity: 200,
    reorderLevel: 50,
    supplier: 'Electrical Depot',
    barcode: '1234567890127',
    description: 'Energy efficient LED bulb with cool white light',
    imageUrl: '/products/4.png',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "6",
    name: 'PVC Pipe 1"',
    sku: "PL-001",
    category: "Plumbing",
    brand: "Supreme",
    purchasePrice: 120,
    sellingPrice: 180,
    quantity: 6,
    reorderLevel: 10,
    supplier: 'Plumbing Supplies',
    barcode: '1234567890128',
    description: 'High quality PVC pipe for plumbing applications',
    imageUrl: '/products/3.png',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "7",
    name: "Measuring Tape 5M",
    sku: "HW-003",
    category: "Hand Tools",
    brand: "Stanley",
    purchasePrice: 100,
    sellingPrice: 160,
    quantity: 55,
    reorderLevel: 20,
    supplier: 'Tools Wholesale',
    barcode: '1234567890129',
    description: 'Professional measuring tape with lock mechanism',
    imageUrl: '/products/2.png',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "8",
    name: "Safety Goggles",
    sku: "SF-001",
    category: "Safety",
    brand: "3M",
    purchasePrice: 150,
    sellingPrice: 250,
    quantity: 40,
    reorderLevel: 15,
    supplier: 'Safety Equipment Co',
    barcode: '1234567890130',
    description: 'Anti-fog safety goggles for eye protection',
    imageUrl: '/products/1.png',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Saman Perera",
    phone: "+94 71 234 5678",
    email: "saman@example.com",
    address: "123 Galle Road, Colombo 03",
    nic: "852456789V",
    outstandingBalance: 0,
    loyaltyPoints: 150,
    createdAt: new Date("2024-01-10"),
    lastPurchase: new Date("2024-10-07"),
  },
  {
    id: "2",
    name: "Nimalka Fernando",
    phone: "+94 77 456 7890",
    email: "nimalka@example.com",
    address: "456 Kandy Road, Kandy",
    nic: "907823456V",
    outstandingBalance: 500,
    loyaltyPoints: 80,
    createdAt: new Date("2024-02-15"),
    lastPurchase: new Date("2024-10-05"),
  },
  {
    id: "3",
    name: "Kasun Silva",
    phone: "+94 76 789 1234",
    address: "789 Negombo Road, Negombo",
    nic: "923456789V",
    outstandingBalance: 1200,
    loyaltyPoints: 200,
    createdAt: new Date("2024-03-20"),
    lastPurchase: new Date("2024-10-01"),
  },
  {
    id: "4",
    name: "Ravi Jayawardena",
    phone: "+94 77 234 9876",
    email: "ravi.jayawardena@example.com",
    address: "15 Temple Road, Dehiwala",
    nic: "801234567V",
    outstandingBalance: 98000,
    loyaltyPoints: 980,
    createdAt: new Date("2023-05-10"),
    lastPurchase: new Date("2024-10-20"),
  },
];

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Admin User",
    role: "admin",
    phone: "+94 71 111 2222",
    email: "admin@hardwarestore.lk",
    salary: 50000,
    joiningDate: new Date("2023-01-01"),
    isActive: true,
    attendanceStatus: "present",
  },
  {
    id: "2",
    name: "Chaminda Manager",
    role: "manager",
    phone: "+94 77 333 4444",
    email: "chaminda@hardwarestore.lk",
    salary: 35000,
    joiningDate: new Date("2023-06-15"),
    isActive: true,
    attendanceStatus: "present",
  },
  {
    id: "3",
    name: "Dilini Cashier",
    role: "cashier",
    phone: "+94 76 555 6666",
    email: "dilini@hardwarestore.lk",
    salary: 25000,
    joiningDate: new Date("2024-01-10"),
    isActive: true,
    attendanceStatus: "present",
  },
  {
    id: "4",
    name: "Rohan Cashier",
    role: "cashier",
    phone: "+94 71 777 8888",
    email: "rohan@hardwarestore.lk",
    salary: 25000,
    joiningDate: new Date("2024-02-01"),
    isActive: true,
    attendanceStatus: "leave",
  },
  {
    id: "5",
    name: "Sanduni Perera",
    role: "cashier",
    phone: "+94 76 888 9999",
    email: "sanduni@hardwarestore.lk",
    salary: 26000,
    joiningDate: new Date("2024-03-15"),
    isActive: true,
    attendanceStatus: "present",
  },
];

// Generate sales data with seasonal patterns for 2024-2025
function generateSalesData(): Sale[] {
  const sales: Sale[] = [];
  let invoiceCounter = 1;
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2025-10-27");

  // Seasonal multipliers (higher in certain months)
  const seasonalPattern = {
    1: 0.7, // January - Low (New Year recovery)
    2: 0.8, // February - Low
    3: 0.9, // March - Building up
    4: 1.2, // April - High (New Year / Spring renovations)
    5: 1.1, // May - Medium-high
    6: 0.9, // June - Medium
    7: 0.8, // July - Low (Monsoon)
    8: 1.0, // August - Medium
    9: 1.1, // September - Medium-high
    10: 1.3, // October - High (Festival season)
    11: 1.4, // November - Peak (Holiday preparations)
    12: 1.5, // December - Peak (Holiday season)
  };

  const customers = [
    "Saman Perera",
    "Nimalka Fernando",
    "Kasun Silva",
    "Ravi Jayawardena",
  ];
  const customerIds = ["1", "2", "3", "4"];
  const cashiers = [
    { id: "2", name: "Chaminda Manager" },
    { id: "3", name: "Dilini Cashier" },
    { id: "4", name: "Rohan Cashier" },
  ];
  const paymentModes: ("cash" | "card" | "upi" | "credit")[] = [
    "cash",
    "card",
    "upi",
    "credit",
  ];

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const month = currentDate.getMonth() + 1;
    const multiplier = seasonalPattern[month as keyof typeof seasonalPattern];

    // Base sales per day varies by month (2-8 sales per day based on season)
    const baseSalesPerDay = Math.floor(3 * multiplier);
    const salesThisDay = baseSalesPerDay + Math.floor(Math.random() * 3);

    // Generate sales for this day
    for (let i = 0; i < salesThisDay; i++) {
      const customerIndex = Math.floor(Math.random() * customers.length);
      const cashier = cashiers[Math.floor(Math.random() * cashiers.length)];
      const paymentMode =
        paymentModes[Math.floor(Math.random() * paymentModes.length)];

      // Random number of items (1-3)
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const items = [];
      let subtotal = 0;
      let totalDiscount = 0;

      for (let j = 0; j < itemCount; j++) {
        const productIndex = Math.floor(Math.random() * mockProducts.length);
        const product = mockProducts[productIndex];

        // Special boost for Paint Brush (ID "4") in April (3x multiplier)
        const isPaintBrush = product.id === "4";
        const isApril = month === 4;
        const paintBoost = isPaintBrush && isApril ? 3.0 : 1.0;

        // Quantity varies by season (more in peak seasons)
        const baseQty = Math.floor(Math.random() * 10) + 1;
        const quantity = Math.floor(baseQty * multiplier * paintBoost);

        const discount = Math.floor(
          Math.random() * (product.sellingPrice * quantity * 0.1)
        );

        items.push({
          product,
          quantity,
          discount,
        });

        subtotal += product.sellingPrice * quantity;
        totalDiscount += discount;
      }

      const tax = Math.floor((subtotal - totalDiscount) * 0.15);
      const total = subtotal - totalDiscount + tax;

      // Random time during business hours (8 AM - 6 PM)
      const hour = 8 + Math.floor(Math.random() * 10);
      const minute = Math.floor(Math.random() * 60);
      const saleDate = new Date(currentDate);
      saleDate.setHours(hour, minute, 0, 0);

      sales.push({
        id: invoiceCounter.toString(),
        invoiceNumber: `INV-${currentDate.getFullYear()}-${String(
          invoiceCounter
        ).padStart(4, "0")}`,
        customerId: customerIds[customerIndex],
        customerName: customers[customerIndex],
        items,
        subtotal,
        discount: totalDiscount,
        tax,
        total,
        paymentMode,
        cashierId: cashier.id,
        cashierName: cashier.name,
        date: saleDate,
        status: "completed",
      });

      invoiceCounter++;
    }

    // Hardcoded Paint Brush sales for last 24 months (Nov 2023 - Oct 2025)
    const dateStr = currentDate.toISOString().split("T")[0];
    const paintBrushProduct = mockProducts.find((p) => p.id === "4");

    // Hardcoded dates with specific quantities - covers full 24 months
    const paintBrushSales: { [key: string]: number } = {
      // 2023 (Nov-Dec)
      "2023-11-15": 3,
      "2023-12-15": 2,

      // 2024 - lower quantities except April
      "2024-01-15": 3,
      "2024-02-15": 2,
      "2024-03-15": 3,
      "2024-04-15": 15, // April 2024 spike
      "2024-05-15": 2,
      "2024-06-15": 3,
      "2024-07-15": 2,
      "2024-08-15": 3,
      "2024-09-15": 2,
      "2024-10-15": 3,
      "2024-11-15": 2, // Nov 2024 - starts the visible 12-month range
      "2024-12-15": 3,

      // 2025 - lower quantities except April
      "2025-01-15": 2,
      "2025-02-15": 3,
      "2025-03-15": 2,
      "2025-04-15": 20, // April 2025 spike
      "2025-05-15": 3,
      "2025-06-15": 2,
      "2025-07-15": 3,
      "2025-08-15": 2,
      "2025-09-15": 3,
      "2025-10-15": 2, // Oct 2025 - current month
    };

    if (paintBrushSales[dateStr] && paintBrushProduct) {
      const targetQuantity = paintBrushSales[dateStr];
      const customerIndex = Math.floor(Math.random() * customers.length);
      const cashier = cashiers[Math.floor(Math.random() * cashiers.length)];
      const paymentMode =
        paymentModes[Math.floor(Math.random() * paymentModes.length)];

      const discount = 0;
      const items = [
        {
          product: paintBrushProduct,
          quantity: targetQuantity,
          discount,
        },
      ];

      const subtotal = paintBrushProduct.sellingPrice * targetQuantity;
      const totalDiscount = discount;
      const tax = Math.floor((subtotal - totalDiscount) * 0.15);
      const total = subtotal - totalDiscount + tax;

      const saleDate = new Date(currentDate);
      saleDate.setHours(10, 30, 0, 0);

      sales.push({
        id: invoiceCounter.toString(),
        invoiceNumber: `INV-${currentDate.getFullYear()}-${String(
          invoiceCounter
        ).padStart(4, "0")}`,
        customerId: customerIds[customerIndex],
        customerName: customers[customerIndex],
        items,
        subtotal,
        discount: totalDiscount,
        tax,
        total,
        paymentMode,
        cashierId: cashier.id,
        cashierName: cashier.name,
        date: saleDate,
        status: "completed",
      });

      invoiceCounter++;
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return sales;
}

// Mock Sales
export const mockSales: Sale[] = generateSalesData();

// Mock Suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Nipulec Paints (Pvt) Ltd",
    contact: "+94 11 289 4500",
    email: "info@nipulecpaints.lk",
    address: "No. 45, Baseline Road, Colombo 09",
    products: ["4"],
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Tools Wholesale LK",
    contact: "+94 11 234 5678",
    email: "sales@toolswholesale.lk",
    address: "Industrial Zone, Ekala, Ja-Ela",
    products: ["1", "2", "7"],
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "3",
    name: "Power Tools Lanka",
    contact: "+94 11 345 6789",
    email: "sales@powertoolslanka.lk",
    address: "Malabe Industrial Park, Colombo",
    products: ["3"],
    createdAt: new Date("2023-02-15"),
  },
  {
    id: "4",
    name: "Abans Electricals",
    contact: "+94 11 230 0300",
    email: "corporate@abans.lk",
    address: "No. 498, Galle Road, Colombo 03",
    products: ["5"],
    createdAt: new Date("2023-01-10"),
  },
  {
    id: "5",
    name: "Supreme Pipes & Fittings",
    contact: "+94 11 456 7890",
    email: "info@supremepipes.lk",
    address: "Kelaniya Industrial Park, Kelaniya",
    products: ["6"],
    createdAt: new Date("2023-03-20"),
  },
  {
    id: "6",
    name: "Lanka Safety Equipment",
    contact: "+94 77 889 9900",
    email: "orders@lankasafety.lk",
    address: "No. 123, Nawala Road, Rajagiriya",
    products: ["8"],
    createdAt: new Date("2023-04-01"),
  },
  {
    id: "7",
    name: "Asian Paints Lanka",
    contact: "+94 11 367 5500",
    email: "customercare@asianpaints.lk",
    address: "Biyagama Export Processing Zone, Walgama",
    products: ["4"],
    createdAt: new Date("2023-01-05"),
  },
  {
    id: "8",
    name: "Singer Hardware Division",
    contact: "+94 11 557 7000",
    email: "hardware@singer.lk",
    address: "No. 385, Old Kottawa Road, Pannipitiya",
    products: ["1", "2", "3", "7"],
    createdAt: new Date("2023-05-12"),
  },
  {
    id: "9",
    name: "Stafford Motor Company",
    contact: "+94 11 232 7777",
    email: "spares@stafford.lk",
    address: "Sir Baron Jayathilaka Mawatha, Colombo 01",
    products: ["3"],
    createdAt: new Date("2023-06-18"),
  },
  {
    id: "10",
    name: "JAT Holdings - Hardware Division",
    contact: "+94 11 243 6543",
    email: "hardware@jat.lk",
    address: "No. 177, Vauxhall Street, Colombo 02",
    products: ["1", "2", "5", "6", "7"],
    createdAt: new Date("2023-02-28"),
  },
  {
    id: "11",
    name: "Tokyo Cement Lanka",
    contact: "+94 11 520 5000",
    email: "sales@tokyocement.lk",
    address: "No. 6, Temple Lane, Colombo 03",
    products: ["9"],
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "12",
    name: "Sika Lanka (Pvt) Ltd",
    contact: "+94 11 243 7676",
    email: "info@lk.sika.com",
    address: "No. 24, Sri Sangaraja Mawatha, Colombo 10",
    products: ["10"],
    createdAt: new Date("2023-03-10"),
  },
];

// Mock Expenses
export const mockExpenses: Expense[] = [
  // October 2025 Expenses
  {
    id: "1",
    date: new Date("2025-10-01"),
    category: "Rent",
    vendor: "Property Owner - Colombo Plaza",
    description: "October 2025 shop rent payment",
    paymentMethod: "Bank Transfer",
    amount: 50000,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-01T08:00:00"),
  },
  {
    id: "2",
    date: new Date("2025-10-01"),
    category: "Salaries",
    vendor: "Staff Payroll",
    description: "September 2025 employee salaries",
    paymentMethod: "Bank Transfer",
    amount: 161000,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-01T10:00:00"),
  },
  {
    id: "3",
    date: new Date("2025-10-03"),
    category: "Utilities",
    vendor: "Dialog Axiata",
    description: "October 2025 internet and phone bill",
    paymentMethod: "Card",
    amount: 5500,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-03T09:15:00"),
  },
  {
    id: "4",
    date: new Date("2025-10-05"),
    category: "Utilities",
    vendor: "Ceylon Electricity Board",
    description: "September 2025 electricity bill",
    paymentMethod: "Cash",
    amount: 8500,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-05T09:30:00"),
  },
  {
    id: "5",
    date: new Date("2025-10-07"),
    category: "Transportation",
    vendor: "Lanka Fuel Station",
    description: "Fuel for delivery vehicle - weekly refill",
    paymentMethod: "Cash",
    amount: 7500,
    paidBy: "Rohan Cashier",
    createdAt: new Date("2025-10-07T08:00:00"),
  },
  {
    id: "6",
    date: new Date("2025-10-08"),
    category: "Supplies",
    vendor: "Stationery World",
    description: "Receipt books, invoice pads, stapler, tape",
    paymentMethod: "Cash",
    amount: 2800,
    paidBy: "Dilini Cashier",
    createdAt: new Date("2025-10-08T14:30:00"),
  },
  {
    id: "7",
    date: new Date("2025-10-10"),
    category: "Maintenance",
    vendor: "Lanka Repair Services",
    description: "Air conditioning system servicing and repair",
    paymentMethod: "Card",
    amount: 12500,
    paidBy: "Chaminda Manager",
    createdAt: new Date("2025-10-10T14:20:00"),
  },
  {
    id: "8",
    date: new Date("2025-10-12"),
    category: "Marketing",
    vendor: "Print Media Solutions",
    description: "Promotional flyers and banners printing",
    paymentMethod: "UPI",
    amount: 8900,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-12T10:45:00"),
  },
  {
    id: "9",
    date: new Date("2025-10-14"),
    category: "Transportation",
    vendor: "Lanka Fuel Station",
    description: "Fuel for delivery vehicle - second refill",
    paymentMethod: "Cash",
    amount: 8000,
    paidBy: "Rohan Cashier",
    createdAt: new Date("2025-10-14T07:45:00"),
  },
  {
    id: "10",
    date: new Date("2025-10-15"),
    category: "Marketing",
    vendor: "Digital Ad Solutions",
    description: "Facebook and Google ads for October campaign",
    paymentMethod: "Card",
    amount: 15000,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-15T11:00:00"),
  },
  {
    id: "11",
    date: new Date("2025-10-16"),
    category: "Miscellaneous",
    vendor: "Clean Pro Services",
    description: "Professional deep cleaning of shop premises",
    paymentMethod: "Cash",
    amount: 4500,
    paidBy: "Chaminda Manager",
    createdAt: new Date("2025-10-16T16:00:00"),
  },
  {
    id: "12",
    date: new Date("2025-10-18"),
    category: "Supplies",
    vendor: "Office Mart LK",
    description: "Office supplies - printer paper, pens, folders",
    paymentMethod: "Cash",
    amount: 4200,
    paidBy: "Chaminda Manager",
    createdAt: new Date("2025-10-18T15:45:00"),
  },
  {
    id: "13",
    date: new Date("2025-10-19"),
    category: "Taxes",
    vendor: "Inland Revenue Department",
    description: "VAT payment for September 2025",
    paymentMethod: "Bank Transfer",
    amount: 35000,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-19T09:00:00"),
  },
  {
    id: "14",
    date: new Date("2025-10-20"),
    category: "Transportation",
    vendor: "Lanka Fuel Station",
    description: "Fuel for delivery vehicle - third refill",
    paymentMethod: "Cash",
    amount: 7800,
    paidBy: "Rohan Cashier",
    createdAt: new Date("2025-10-20T08:15:00"),
  },
  {
    id: "15",
    date: new Date("2025-10-22"),
    category: "Insurance",
    vendor: "Ceylinco Insurance",
    description: "Quarterly business insurance premium",
    paymentMethod: "Bank Transfer",
    amount: 25000,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-22T10:30:00"),
  },
  {
    id: "16",
    date: new Date("2025-10-23"),
    category: "Maintenance",
    vendor: "Security Systems Lanka",
    description: "CCTV camera maintenance and new installation",
    paymentMethod: "Card",
    amount: 18500,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-23T11:20:00"),
  },
  {
    id: "17",
    date: new Date("2025-10-24"),
    category: "Supplies",
    vendor: "Packaging Mart",
    description: "Shopping bags, bubble wrap, packing tape",
    paymentMethod: "Cash",
    amount: 3200,
    paidBy: "Dilini Cashier",
    createdAt: new Date("2025-10-24T13:00:00"),
  },
  {
    id: "18",
    date: new Date("2025-10-25"),
    category: "Miscellaneous",
    vendor: "Lanka Post Office",
    description: "Postal charges and courier fees",
    paymentMethod: "Cash",
    amount: 1200,
    paidBy: "Chaminda Manager",
    createdAt: new Date("2025-10-25T15:30:00"),
  },
  {
    id: "19",
    date: new Date("2025-10-26"),
    category: "Marketing",
    vendor: "Radio Advertising Lanka",
    description: "Radio advertisement slots for November",
    paymentMethod: "Bank Transfer",
    amount: 22000,
    paidBy: "Admin User",
    createdAt: new Date("2025-10-26T10:00:00"),
  },
  {
    id: "20",
    date: new Date("2025-10-27"),
    category: "Transportation",
    vendor: "Lanka Fuel Station",
    description: "Fuel for delivery vehicle - latest refill",
    paymentMethod: "Cash",
    amount: 8200,
    paidBy: "Rohan Cashier",
    createdAt: new Date("2025-10-27T08:30:00"),
  },

  // September 2025 Expenses
  {
    id: "21",
    date: new Date("2025-09-01"),
    category: "Rent",
    vendor: "Property Owner - Colombo Plaza",
    description: "September 2025 shop rent payment",
    paymentMethod: "Bank Transfer",
    amount: 50000,
    paidBy: "Admin User",
    createdAt: new Date("2025-09-01T08:00:00"),
  },
  {
    id: "22",
    date: new Date("2025-09-01"),
    category: "Salaries",
    vendor: "Staff Payroll",
    description: "August 2025 employee salaries",
    paymentMethod: "Bank Transfer",
    amount: 161000,
    paidBy: "Admin User",
    createdAt: new Date("2025-09-01T10:00:00"),
  },
  {
    id: "23",
    date: new Date("2025-09-05"),
    category: "Utilities",
    vendor: "Ceylon Electricity Board",
    description: "August 2025 electricity bill",
    paymentMethod: "Cash",
    amount: 7800,
    paidBy: "Admin User",
    createdAt: new Date("2025-09-05T09:30:00"),
  },
  {
    id: "24",
    date: new Date("2025-09-08"),
    category: "Maintenance",
    vendor: "Plumbing Services Lanka",
    description: "Bathroom and sink repairs",
    paymentMethod: "Cash",
    amount: 5500,
    paidBy: "Chaminda Manager",
    createdAt: new Date("2025-09-08T14:00:00"),
  },
  {
    id: "25",
    date: new Date("2025-09-10"),
    category: "Marketing",
    vendor: "Social Media Boost",
    description: "Instagram and Facebook promotion September",
    paymentMethod: "Card",
    amount: 12000,
    paidBy: "Admin User",
    createdAt: new Date("2025-09-10T11:30:00"),
  },
  {
    id: "26",
    date: new Date("2025-09-12"),
    category: "Transportation",
    vendor: "Lanka Fuel Station",
    description: "Fuel for delivery vehicle",
    paymentMethod: "Cash",
    amount: 7200,
    paidBy: "Rohan Cashier",
    createdAt: new Date("2025-09-12T08:00:00"),
  },
  {
    id: "27",
    date: new Date("2025-09-15"),
    category: "Maintenance",
    vendor: "Quick Fix Hardware Services",
    description: "Repair of display shelves and lighting",
    paymentMethod: "UPI",
    amount: 6500,
    paidBy: "Admin User",
    createdAt: new Date("2025-09-15T13:20:00"),
  },
  {
    id: "28",
    date: new Date("2025-09-18"),
    category: "Supplies",
    vendor: "Office Mart LK",
    description: "Printer ink cartridges and paper",
    paymentMethod: "Cash",
    amount: 3800,
    paidBy: "Dilini Cashier",
    createdAt: new Date("2025-09-18T15:00:00"),
  },
  {
    id: "29",
    date: new Date("2025-09-20"),
    category: "Utilities",
    vendor: "Dialog Axiata",
    description: "September 2025 internet and phone bill",
    paymentMethod: "Card",
    amount: 5200,
    paidBy: "Admin User",
    createdAt: new Date("2025-09-20T10:00:00"),
  },
  {
    id: "30",
    date: new Date("2025-09-22"),
    category: "Miscellaneous",
    vendor: "Pest Control Services",
    description: "Quarterly pest control treatment",
    paymentMethod: "Cash",
    amount: 3500,
    paidBy: "Chaminda Manager",
    createdAt: new Date("2025-09-22T16:30:00"),
  },
  {
    id: "31",
    date: new Date("2025-09-25"),
    category: "Transportation",
    vendor: "Vehicle Service Center",
    description: "Delivery van servicing and oil change",
    paymentMethod: "Card",
    amount: 9500,
    paidBy: "Admin User",
    createdAt: new Date("2025-09-25T11:00:00"),
  },
  {
    id: "32",
    date: new Date("2025-09-28"),
    category: "Utilities",
    vendor: "National Water Supply Board",
    description: "September 2025 water bill",
    paymentMethod: "Cash",
    amount: 1800,
    paidBy: "Chaminda Manager",
    createdAt: new Date("2025-09-28T16:00:00"),
  },
];

// Initialize Dummy Attendance Data for Current Month
export function initializeDummyAttendance() {
  const ATTENDANCE_STORAGE_KEY = "pos.attendance.v1";

  // Check if attendance data already exists
  const existingData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
  if (existingData) {
    const parsed = JSON.parse(existingData);
    // If there's already substantial data, don't overwrite
    if (Object.keys(parsed).length > 10) {
      return;
    }
  }

  const attendanceData: Record<string, string> = existingData
    ? JSON.parse(existingData)
    : {};

  // Generate attendance for current month (October 2025)
  const currentMonth = new Date(2025, 9, 1); // October 2025
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Define realistic attendance patterns for each employee
  const attendancePatterns = {
    "1": {
      // Admin User - Very reliable
      presentRate: 0.95,
      lateRate: 0.03,
      leaveRate: 0.02,
      absentRate: 0.0,
    },
    "2": {
      // Chaminda Manager - Reliable
      presentRate: 0.9,
      lateRate: 0.05,
      leaveRate: 0.03,
      absentRate: 0.02,
    },
    "3": {
      // Dilini Cashier - Good attendance
      presentRate: 0.88,
      lateRate: 0.07,
      leaveRate: 0.03,
      absentRate: 0.02,
    },
    "4": {
      // Rohan Cashier - Occasional issues
      presentRate: 0.82,
      lateRate: 0.1,
      leaveRate: 0.05,
      absentRate: 0.03,
    },
    "5": {
      // Sanduni Perera - Very good attendance
      presentRate: 0.91,
      lateRate: 0.04,
      leaveRate: 0.03,
      absentRate: 0.02,
    },
  };

  mockEmployees.forEach((employee) => {
    const pattern =
      attendancePatterns[employee.id as keyof typeof attendancePatterns];
    if (!pattern) return;

    days.forEach((day, index) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const key = `${employee.id}-${dateStr}`;

      // Skip future dates (after Oct 27, 2025)
      if (day > new Date(2025, 9, 27)) {
        return;
      }

      // Skip weekends (no attendance tracking)
      if (isWeekend(day)) {
        return;
      }

      // Generate random attendance based on patterns
      const rand = Math.random();
      let status: string;

      if (rand < pattern.presentRate) {
        status = "Present";
      } else if (rand < pattern.presentRate + pattern.lateRate) {
        status = "Late";
      } else if (
        rand <
        pattern.presentRate + pattern.lateRate + pattern.leaveRate
      ) {
        status = "On Leave";
      } else {
        status = "Absent";
      }

      // Add some specific scenarios for realism
      // Employee 4 was on leave on Oct 21-22
      if (employee.id === "4" && (index === 20 || index === 21)) {
        status = "On Leave";
      }

      // Employee 3 was late on Oct 15
      if (employee.id === "3" && index === 14) {
        status = "Late";
      }

      // Employee 2 had leave on Oct 10
      if (employee.id === "2" && index === 9) {
        status = "On Leave";
      }

      // Employee 5 was late on Oct 8 and absent on Oct 23
      if (employee.id === "5" && index === 7) {
        status = "Late";
      }
      if (employee.id === "5" && index === 22) {
        status = "Absent";
      }

      // Admin was always present (override random for first employee)
      if (employee.id === "1") {
        status = "Present";
      }

      attendanceData[key] = status;
    });
  });

  // Save to localStorage
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendanceData));
  console.log(
    "Dummy attendance data initialized for October 2025 (5 employees, ~100 records)"
  );
}
