export type UserRole = "super_admin" | "sub_admin";
export type Region = "vellore" | "salem" | "chennai" | "kanchipuram";
export type ServiceType = "warranty" | "non_warranty" | "doc" | "amc" | "rental";
export type CallStatus = "pending" | "closed" | "taken_for_service";

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: UserRole;
  region: Region | null;
}

export interface Material {
  id: number;
  user: number | null;
  region: Region | null;
  region_display: string;
  // Customer Info
  cust_name: string;
  cust_contact: string;
  cust_address: string;
  // Service Details
  service_type: ServiceType;
  service_type_display: string;
  product_name: string;
  serial_number: string;
  case_id: string;
  condition_received: string;
  arrival_date: string | null;
  delivery_date: string | null;
  // Issue
  issue_description: string;
  // Part Details
  part_number: string;
  part_usage: string;
  failure_code: string;
  part_description: string;
  qty: number;
  ct_code: string;
  so_req_id: string;
  removed_part_sno: string;
  installed_part_sno: string;
  // Resolution & Engineer
  resolution_summary: string;
  engineer_name: string;
  hp_id: string;
  call_status: CallStatus;
  call_status_display: string;
  explanation: string;
  customer_comments: string;
  // Timestamps
  created_at: string;
  updated_at: string;
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
  access: string;
  refresh: string;
  user: User;
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

export const REGION_LABELS: Record<Region, string> = {
  vellore: "Vellore",
  salem: "Salem",
  chennai: "Chennai",
  kanchipuram: "Kanchipuram",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  warranty: "Warranty",
  non_warranty: "Non Warranty",
  doc: "DOC",
  amc: "AMC",
  rental: "Rental",
};

export const CALL_STATUS_LABELS: Record<CallStatus, string> = {
  pending: "Pending",
  closed: "Closed",
  taken_for_service: "Taken for Service",
};
