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
    supplier: "Tools Wholesale",
    barcode: "1234567890123",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
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
    supplier: "Tools Wholesale",
    barcode: "1234567890124",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
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
    supplier: "Power Tools Inc",
    barcode: "1234567890125",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
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
    supplier: "Paint Supplies Co",
    barcode: "1234567890126",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
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
    supplier: "Electrical Depot",
    barcode: "1234567890127",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
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
    supplier: "Plumbing Supplies",
    barcode: "1234567890128",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
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
    supplier: "Tools Wholesale",
    barcode: "1234567890129",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
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
    supplier: "Safety Equipment Co",
    barcode: "1234567890130",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "9",
    name: "Portland Cement 50kg",
    sku: "CM-001",
    category: "Building Materials",
    brand: "Tokyo Cement",
    purchasePrice: 1800,
    sellingPrice: 2500,
    quantity: 285,
    reorderLevel: 50,
    supplier: "Tokyo Cement Lanka",
    barcode: "1234567890131",
    description:
      "High-quality Portland cement suitable for all construction purposes",
    trackBatches: true,
    batches: [
      {
        id: "b1",
        batchNumber: "TCL-2024-OCT-001",
        quantity: 100,
        manufactureDate: new Date("2024-10-01"),
        expiryDate: new Date("2025-04-01"), // 6 months from manufacture
        notes: "Fresh stock - Store in dry place",
        createdAt: new Date("2024-10-05"),
      },
      {
        id: "b2",
        batchNumber: "TCL-2024-SEP-045",
        quantity: 85,
        manufactureDate: new Date("2024-09-15"),
        expiryDate: new Date("2025-03-15"), // 6 months from manufacture
        notes: "Good condition",
        createdAt: new Date("2024-09-20"),
      },
      {
        id: "b3",
        batchNumber: "TCL-2024-AUG-098",
        quantity: 50,
        manufactureDate: new Date("2024-08-10"),
        expiryDate: new Date("2025-02-10"), // 6 months from manufacture - expiring soon
        notes: "Sell first - Expiring in 3 months",
        createdAt: new Date("2024-08-15"),
      },
      {
        id: "b4",
        batchNumber: "TCL-2024-NOV-012",
        quantity: 50,
        manufactureDate: new Date("2024-11-01"),
        expiryDate: new Date("2025-05-01"), // 6 months from manufacture
        notes: "Latest batch",
        createdAt: new Date("2024-11-05"),
      },
    ],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-11-05"),
  },
  {
    id: "10",
    name: "Waterproofing Chemical 20L",
    sku: "CH-001",
    category: "Chemicals",
    brand: "Sika",
    purchasePrice: 8500,
    sellingPrice: 12000,
    quantity: 48,
    reorderLevel: 10,
    supplier: "Sika Lanka",
    barcode: "1234567890132",
    description: "Premium waterproofing solution for concrete and masonry",
    trackBatches: true,
    batches: [
      {
        id: "b5",
        batchNumber: "SIKA-WP-2024-09",
        quantity: 30,
        manufactureDate: new Date("2024-09-01"),
        expiryDate: new Date("2025-03-01"), // 6 months expiry
        notes: "Store away from direct sunlight",
        createdAt: new Date("2024-09-10"),
      },
      {
        id: "b6",
        batchNumber: "SIKA-WP-2024-10",
        quantity: 18,
        manufactureDate: new Date("2024-10-15"),
        expiryDate: new Date("2025-04-15"), // 6 months expiry
        notes: "Keep container tightly closed",
        createdAt: new Date("2024-10-20"),
      },
    ],
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-10-20"),
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

// Mock Sales
export const mockSales: Sale[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-0001",
    customerId: "1",
    customerName: "Saman Perera",
    items: [
      {
        product: mockProducts[0],
        quantity: 2,
        discount: 0,
      },
      {
        product: mockProducts[1],
        quantity: 1,
        discount: 50,
      },
    ],
    subtotal: 950,
    discount: 50,
    tax: 135,
    total: 1035,
    paymentMode: "card",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-26T08:30:00Z"), // Today morning
    status: "completed",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-0002",
    customerId: "2",
    customerName: "Nimalka Fernando",
    items: [
      {
        product: mockProducts[2],
        quantity: 1,
        discount: 200,
      },
    ],
    subtotal: 5200,
    discount: 200,
    tax: 750,
    total: 5750,
    paymentMode: "upi",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-26T09:15:00Z"), // Today morning
    status: "completed",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-0003",
    customerId: "4",
    customerName: "Ravi Jayawardena",
    items: [
      {
        product: mockProducts[2],
        quantity: 5,
        discount: 1000,
      },
      {
        product: mockProducts[0],
        quantity: 10,
        discount: 0,
      },
    ],
    subtotal: 28500,
    discount: 1000,
    tax: 4125,
    total: 31625,
    paymentMode: "credit",
    cashierId: "2",
    cashierName: "Chaminda Manager",
    date: new Date("2024-10-26T10:00:00Z"), // Today morning
    status: "completed",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-0004",
    customerId: "4",
    customerName: "Ravi Jayawardena",
    items: [
      {
        product: mockProducts[3],
        quantity: 50,
        discount: 200,
      },
      {
        product: mockProducts[4],
        quantity: 100,
        discount: 500,
      },
    ],
    subtotal: 16250,
    discount: 700,
    tax: 2332,
    total: 17882,
    paymentMode: "credit",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-26T11:20:00Z"), // Today
    status: "completed",
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-0005",
    customerId: "4",
    customerName: "Ravi Jayawardena",
    items: [
      {
        product: mockProducts[6],
        quantity: 25,
        discount: 0,
      },
      {
        product: mockProducts[7],
        quantity: 20,
        discount: 250,
      },
    ],
    subtotal: 9000,
    discount: 250,
    tax: 1312,
    total: 10062,
    paymentMode: "credit",
    cashierId: "4",
    cashierName: "Rohan Cashier",
    date: new Date("2024-10-26T13:45:00Z"), // Today afternoon
    status: "completed",
  },
  {
    id: "6",
    invoiceNumber: "INV-2024-0006",
    customerId: "4",
    customerName: "Ravi Jayawardena",
    items: [
      {
        product: mockProducts[2],
        quantity: 3,
        discount: 500,
      },
      {
        product: mockProducts[1],
        quantity: 15,
        discount: 350,
      },
    ],
    subtotal: 22350,
    discount: 850,
    tax: 3225,
    total: 24725,
    paymentMode: "credit",
    cashierId: "2",
    cashierName: "Chaminda Manager",
    date: new Date("2024-10-25T14:30:00Z"), // Yesterday
    status: "completed",
  },
  {
    id: "7",
    invoiceNumber: "INV-2024-0007",
    customerId: "4",
    customerName: "Ravi Jayawardena",
    items: [
      {
        product: mockProducts[5],
        quantity: 30,
        discount: 200,
      },
      {
        product: mockProducts[4],
        quantity: 80,
        discount: 300,
      },
    ],
    subtotal: 15000,
    discount: 500,
    tax: 2175,
    total: 16675,
    paymentMode: "credit",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-25T10:15:00Z"), // Yesterday
    status: "completed",
  },
  {
    id: "8",
    invoiceNumber: "INV-2024-0008",
    customerId: "1",
    customerName: "Saman Perera",
    items: [
      {
        product: mockProducts[4],
        quantity: 25,
        discount: 100,
      },
    ],
    subtotal: 3000,
    discount: 100,
    tax: 435,
    total: 3335,
    paymentMode: "cash",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-24T09:00:00Z"), // 2 days ago
    status: "completed",
  },
  {
    id: "9",
    invoiceNumber: "INV-2024-0009",
    customerId: "2",
    customerName: "Nimalka Fernando",
    items: [
      {
        product: mockProducts[0],
        quantity: 5,
        discount: 0,
      },
      {
        product: mockProducts[6],
        quantity: 10,
        discount: 150,
      },
    ],
    subtotal: 2850,
    discount: 150,
    tax: 405,
    total: 3105,
    paymentMode: "card",
    cashierId: "4",
    cashierName: "Rohan Cashier",
    date: new Date("2024-10-24T11:30:00Z"), // 2 days ago
    status: "completed",
  },
  {
    id: "10",
    invoiceNumber: "INV-2024-0010",
    customerId: "3",
    customerName: "Kasun Silva",
    items: [
      {
        product: mockProducts[8],
        quantity: 10,
        discount: 500,
      },
    ],
    subtotal: 25000,
    discount: 500,
    tax: 3675,
    total: 28175,
    paymentMode: "card",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-23T14:20:00Z"), // 3 days ago
    status: "completed",
  },
  {
    id: "11",
    invoiceNumber: "INV-2024-0011",
    customerId: "1",
    customerName: "Saman Perera",
    items: [
      {
        product: mockProducts[7],
        quantity: 5,
        discount: 0,
      },
      {
        product: mockProducts[3],
        quantity: 10,
        discount: 85,
      },
    ],
    subtotal: 2100,
    discount: 85,
    tax: 302,
    total: 2317,
    paymentMode: "cash",
    cashierId: "4",
    cashierName: "Rohan Cashier",
    date: new Date("2024-10-23T16:45:00Z"), // 3 days ago
    status: "completed",
  },
  {
    id: "12",
    invoiceNumber: "INV-2024-0012",
    customerId: "2",
    customerName: "Nimalka Fernando",
    items: [
      {
        product: mockProducts[1],
        quantity: 3,
        discount: 100,
      },
      {
        product: mockProducts[5],
        quantity: 20,
        discount: 300,
      },
    ],
    subtotal: 4950,
    discount: 400,
    tax: 682,
    total: 5232,
    paymentMode: "upi",
    cashierId: "2",
    cashierName: "Chaminda Manager",
    date: new Date("2024-10-22T10:10:00Z"), // 4 days ago
    status: "completed",
  },
  {
    id: "13",
    invoiceNumber: "INV-2024-0013",
    customerId: "3",
    customerName: "Kasun Silva",
    items: [
      {
        product: mockProducts[9],
        quantity: 5,
        discount: 1000,
      },
    ],
    subtotal: 60000,
    discount: 1000,
    tax: 8850,
    total: 67850,
    paymentMode: "card",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-22T15:00:00Z"), // 4 days ago
    status: "completed",
  },
  {
    id: "14",
    invoiceNumber: "INV-2024-0014",
    customerId: "4",
    customerName: "Ravi Jayawardena",
    items: [
      {
        product: mockProducts[2],
        quantity: 2,
        discount: 400,
      },
    ],
    subtotal: 10400,
    discount: 400,
    tax: 1500,
    total: 11500,
    paymentMode: "credit",
    cashierId: "4",
    cashierName: "Rohan Cashier",
    date: new Date("2024-10-21T09:30:00Z"), // 5 days ago
    status: "completed",
  },
  {
    id: "15",
    invoiceNumber: "INV-2024-0015",
    customerId: "1",
    customerName: "Saman Perera",
    items: [
      {
        product: mockProducts[4],
        quantity: 50,
        discount: 200,
      },
      {
        product: mockProducts[6],
        quantity: 15,
        discount: 100,
      },
    ],
    subtotal: 8400,
    discount: 300,
    tax: 1215,
    total: 9315,
    paymentMode: "card",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-21T11:00:00Z"), // 5 days ago
    status: "completed",
  },
  {
    id: "16",
    invoiceNumber: "INV-2024-0016",
    customerId: "2",
    customerName: "Nimalka Fernando",
    items: [
      {
        product: mockProducts[0],
        quantity: 8,
        discount: 0,
      },
    ],
    subtotal: 2000,
    discount: 0,
    tax: 300,
    total: 2300,
    paymentMode: "cash",
    cashierId: "2",
    cashierName: "Chaminda Manager",
    date: new Date("2024-10-20T13:20:00Z"), // 6 days ago
    status: "completed",
  },
  {
    id: "17",
    invoiceNumber: "INV-2024-0017",
    customerId: "3",
    customerName: "Kasun Silva",
    items: [
      {
        product: mockProducts[8],
        quantity: 15,
        discount: 1500,
      },
      {
        product: mockProducts[9],
        quantity: 2,
        discount: 500,
      },
    ],
    subtotal: 61500,
    discount: 2000,
    tax: 8925,
    total: 68425,
    paymentMode: "card",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-20T15:45:00Z"), // 6 days ago
    status: "completed",
  },
  {
    id: "18",
    invoiceNumber: "INV-2024-0018",
    customerId: "1",
    customerName: "Saman Perera",
    items: [
      {
        product: mockProducts[7],
        quantity: 10,
        discount: 150,
      },
    ],
    subtotal: 2500,
    discount: 150,
    tax: 352,
    total: 2702,
    paymentMode: "upi",
    cashierId: "4",
    cashierName: "Rohan Cashier",
    date: new Date("2024-10-19T10:00:00Z"), // 7 days ago
    status: "completed",
  },
  {
    id: "19",
    invoiceNumber: "INV-2024-0019",
    customerId: "4",
    customerName: "Ravi Jayawardena",
    items: [
      {
        product: mockProducts[1],
        quantity: 20,
        discount: 900,
      },
      {
        product: mockProducts[3],
        quantity: 30,
        discount: 255,
      },
    ],
    subtotal: 11550,
    discount: 1155,
    tax: 1559,
    total: 11954,
    paymentMode: "credit",
    cashierId: "2",
    cashierName: "Chaminda Manager",
    date: new Date("2024-10-19T14:30:00Z"), // 7 days ago
    status: "completed",
  },
  {
    id: "20",
    invoiceNumber: "INV-2024-0020",
    customerId: "2",
    customerName: "Nimalka Fernando",
    items: [
      {
        product: mockProducts[5],
        quantity: 40,
        discount: 720,
      },
    ],
    subtotal: 7200,
    discount: 720,
    tax: 972,
    total: 7452,
    paymentMode: "card",
    cashierId: "3",
    cashierName: "Dilini Cashier",
    date: new Date("2024-10-18T09:15:00Z"), // 8 days ago
    status: "completed",
  },
];

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
  {
    id: "1",
    category: "Rent",
    amount: 25000,
    description: "October 2024 Rent",
    date: new Date("2024-10-01"),
    paidBy: "Admin User",
  },
  {
    id: "2",
    category: "Electricity",
    amount: 3500,
    description: "September 2024 Bill",
    date: new Date("2024-10-02"),
    paidBy: "Admin User",
  },
  {
    id: "3",
    category: "Salaries",
    amount: 135000,
    description: "September 2024 Staff Salaries",
    date: new Date("2024-10-01"),
    paidBy: "Admin User",
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
    "✅ Dummy attendance data initialized for October 2025 (5 employees, ~100 records)"
  );
}
