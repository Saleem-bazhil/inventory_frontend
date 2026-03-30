export interface Material {
  id: number;
  cust_name: string;
  cust_contact: string;
  case_id: string;
  so_number: string;
  warranty: boolean;
  issue: string;
  product: string;
  model_name: string;
  part_number: string;
  serial_number: string;
  qty: number;
  hp_part_in_date: string | null;
  aging: number | null;
  out_date: string | null;
  collector: string;
  in_date: string | null;
  receiver: string;
  used_part: boolean;
  remarks: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  total_transactions: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  type: "in" | "out";
  material_id: string;
  customer_id: string;
  material_name: string;
  customer_name: string;
  quantity: number;
  date: string;
  notes: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface DashboardStats {
  total_materials: number;
  total_stock: number;
  low_stock_count: number;
  today_transactions: number;
}

export interface ChartData {
  stock_movement: { month: string; inflow: number; outflow: number }[];
  top_materials: { name: string; stock: number }[];
}

export interface ReportSummary {
  inventory_value: number;
  total_inflow: number;
  total_outflow: number;
  category_count: number;
}

export interface CategoryBreakdown {
  category: string;
  total_stock: number;
  material_count: number;
  value: number;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
  email: string;
  message: string;
}

export interface MaterialQueryParams {
  search?: string;
  category?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface CustomerQueryParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface TransactionQueryParams {
  type?: "in" | "out";
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}
