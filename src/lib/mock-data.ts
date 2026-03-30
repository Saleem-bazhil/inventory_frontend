import type {
  Material,
  Customer,
  Transaction,
  DashboardStats,
  ChartData,
  ReportSummary,
  CategoryBreakdown,
} from "@/types";

export const mockMaterials: Material[] = [
  { id: "MAT-001", name: "Steel Sheet", category: "Raw Material", sku: "STL-001", stock: 12500, min_stock: 2000, unit: "kg", unit_price: 3.5, status: "normal", last_updated: "2026-03-28T10:00:00Z" },
  { id: "MAT-002", name: "Hex Bolts", category: "Component", sku: "HEX-002", stock: 8500, min_stock: 1000, unit: "pcs", unit_price: 0.25, status: "normal", last_updated: "2026-03-28T09:00:00Z" },
  { id: "MAT-003", name: "PCB Board", category: "Component", sku: "PCB-003", stock: 6200, min_stock: 500, unit: "pcs", unit_price: 12.0, status: "normal", last_updated: "2026-03-27T15:00:00Z" },
  { id: "MAT-004", name: "Cardboard Box", category: "Packaging", sku: "BOX-004", stock: 5800, min_stock: 1000, unit: "pcs", unit_price: 1.2, status: "normal", last_updated: "2026-03-27T12:00:00Z" },
  { id: "MAT-005", name: "Capacitor", category: "Component", sku: "CAP-005", stock: 4200, min_stock: 800, unit: "pcs", unit_price: 0.15, status: "normal", last_updated: "2026-03-26T14:00:00Z" },
  { id: "MAT-006", name: "Copper Wire", category: "Raw Material", sku: "COP-006", stock: 320, min_stock: 500, unit: "meters", unit_price: 2.8, status: "low", last_updated: "2026-03-26T10:00:00Z" },
  { id: "MAT-007", name: "LED Bulb", category: "Finished Good", sku: "LED-007", stock: 150, min_stock: 200, unit: "pcs", unit_price: 5.5, status: "low", last_updated: "2026-03-25T16:00:00Z" },
  { id: "MAT-008", name: "Bubble Wrap", category: "Packaging", sku: "BWR-008", stock: 0, min_stock: 100, unit: "meters", unit_price: 0.8, status: "out", last_updated: "2026-03-25T11:00:00Z" },
  { id: "MAT-009", name: "Resistor Pack", category: "Component", sku: "RES-009", stock: 9800, min_stock: 1000, unit: "pcs", unit_price: 0.05, status: "normal", last_updated: "2026-03-25T09:00:00Z" },
  { id: "MAT-010", name: "Aluminum Rod", category: "Raw Material", sku: "ALU-010", stock: 45, min_stock: 100, unit: "kg", unit_price: 6.0, status: "low", last_updated: "2026-03-24T14:00:00Z" },
  { id: "MAT-011", name: "Plastic Casing", category: "Finished Good", sku: "PLC-011", stock: 3400, min_stock: 500, unit: "pcs", unit_price: 2.0, status: "normal", last_updated: "2026-03-24T10:00:00Z" },
  { id: "MAT-012", name: "Thermal Paste", category: "Consumable", sku: "THP-012", stock: 0, min_stock: 50, unit: "pcs", unit_price: 8.0, status: "out", last_updated: "2026-03-23T15:00:00Z" },
];

export const mockCustomers: Customer[] = [
  { id: "CUS-001", name: "Acme Corporation", email: "contact@acme.com", phone: "+1-555-0101", company: "Acme Corp", total_transactions: 24, created_at: "2025-08-15T10:00:00Z" },
  { id: "CUS-002", name: "TechFlow Industries", email: "orders@techflow.io", phone: "+1-555-0102", company: "TechFlow", total_transactions: 18, created_at: "2025-09-01T10:00:00Z" },
  { id: "CUS-003", name: "BuildRight LLC", email: "supply@buildright.com", phone: "+1-555-0103", company: "BuildRight", total_transactions: 31, created_at: "2025-07-20T10:00:00Z" },
  { id: "CUS-004", name: "GreenPack Solutions", email: "info@greenpack.co", phone: "+1-555-0104", company: "GreenPack", total_transactions: 12, created_at: "2025-10-05T10:00:00Z" },
  { id: "CUS-005", name: "Nova Electronics", email: "procurement@nova.com", phone: "+1-555-0105", company: "Nova Electronics", total_transactions: 45, created_at: "2025-06-10T10:00:00Z" },
  { id: "CUS-006", name: "Metro Supplies", email: "orders@metro.com", phone: "+1-555-0106", company: "Metro Supplies Inc", total_transactions: 8, created_at: "2025-11-12T10:00:00Z" },
  { id: "CUS-007", name: "Pinnacle Manufacturing", email: "buy@pinnacle.com", phone: "+1-555-0107", company: "Pinnacle Mfg", total_transactions: 22, created_at: "2025-08-28T10:00:00Z" },
  { id: "CUS-008", name: "Horizon Traders", email: "trade@horizon.net", phone: "+1-555-0108", company: "Horizon Trading Co", total_transactions: 15, created_at: "2025-09-18T10:00:00Z" },
];

export const mockTransactions: Transaction[] = [
  { id: "TXN-001", type: "in", material_id: "MAT-001", customer_id: "CUS-001", material_name: "Steel Sheet", customer_name: "Acme Corporation", quantity: 2500, date: "2026-03-30T08:00:00Z", notes: "Monthly restock order", created_at: "2026-03-30T08:00:00Z" },
  { id: "TXN-002", type: "out", material_id: "MAT-002", customer_id: "CUS-005", material_name: "Hex Bolts", customer_name: "Nova Electronics", quantity: 1200, date: "2026-03-30T09:30:00Z", notes: "Assembly line supply", created_at: "2026-03-30T09:30:00Z" },
  { id: "TXN-003", type: "in", material_id: "MAT-003", customer_id: "CUS-002", material_name: "PCB Board", customer_name: "TechFlow Industries", quantity: 800, date: "2026-03-29T14:00:00Z", notes: "New batch received", created_at: "2026-03-29T14:00:00Z" },
  { id: "TXN-004", type: "out", material_id: "MAT-004", customer_id: "CUS-003", material_name: "Cardboard Box", customer_name: "BuildRight LLC", quantity: 500, date: "2026-03-29T11:00:00Z", notes: "Packaging for shipment", created_at: "2026-03-29T11:00:00Z" },
  { id: "TXN-005", type: "in", material_id: "MAT-005", customer_id: "CUS-005", material_name: "Capacitor", customer_name: "Nova Electronics", quantity: 3000, date: "2026-03-28T16:00:00Z", notes: "Bulk order", created_at: "2026-03-28T16:00:00Z" },
  { id: "TXN-006", type: "out", material_id: "MAT-001", customer_id: "CUS-007", material_name: "Steel Sheet", customer_name: "Pinnacle Manufacturing", quantity: 1800, date: "2026-03-28T10:00:00Z", notes: "Production run", created_at: "2026-03-28T10:00:00Z" },
  { id: "TXN-007", type: "in", material_id: "MAT-009", customer_id: "CUS-002", material_name: "Resistor Pack", customer_name: "TechFlow Industries", quantity: 5000, date: "2026-03-27T13:00:00Z", notes: "Quarterly supply", created_at: "2026-03-27T13:00:00Z" },
  { id: "TXN-008", type: "out", material_id: "MAT-006", customer_id: "CUS-004", material_name: "Copper Wire", customer_name: "GreenPack Solutions", quantity: 150, date: "2026-03-27T09:00:00Z", notes: "Custom wiring job", created_at: "2026-03-27T09:00:00Z" },
  { id: "TXN-009", type: "in", material_id: "MAT-011", customer_id: "CUS-008", material_name: "Plastic Casing", customer_name: "Horizon Traders", quantity: 1000, date: "2026-03-26T15:00:00Z", notes: "Replacement stock", created_at: "2026-03-26T15:00:00Z" },
  { id: "TXN-010", type: "out", material_id: "MAT-007", customer_id: "CUS-006", material_name: "LED Bulb", customer_name: "Metro Supplies", quantity: 200, date: "2026-03-26T11:00:00Z", notes: "Retail distribution", created_at: "2026-03-26T11:00:00Z" },
];

export const mockDashboardStats: DashboardStats = {
  total_materials: 12,
  total_stock: 28028,
  low_stock_count: 4,
  today_transactions: 2,
};

export const mockChartData: ChartData = {
  stock_movement: [
    { month: "Oct", inflow: 3800, outflow: 3200 },
    { month: "Nov", inflow: 4200, outflow: 3600 },
    { month: "Dec", inflow: 5100, outflow: 3400 },
    { month: "Jan", inflow: 4800, outflow: 4100 },
    { month: "Feb", inflow: 4500, outflow: 3900 },
    { month: "Mar", inflow: 5300, outflow: 4600 },
  ],
  top_materials: [
    { name: "Steel Sheet", stock: 12500 },
    { name: "Hex Bolts", stock: 8500 },
    { name: "PCB Board", stock: 6200 },
    { name: "Cardboard Box", stock: 5800 },
    { name: "Capacitor", stock: 4200 },
  ],
};

export const mockReportSummary: ReportSummary = {
  inventory_value: 142580.0,
  total_inflow: 16100,
  total_outflow: 3850,
  category_count: 5,
};

export const mockCategories: CategoryBreakdown[] = [
  { category: "Raw Material", total_stock: 12865, material_count: 3, value: 48250 },
  { category: "Component", total_stock: 28700, material_count: 4, value: 35100 },
  { category: "Packaging", total_stock: 5800, material_count: 2, value: 6960 },
  { category: "Finished Good", total_stock: 3550, material_count: 2, value: 7625 },
  { category: "Consumable", total_stock: 0, material_count: 1, value: 0 },
];
