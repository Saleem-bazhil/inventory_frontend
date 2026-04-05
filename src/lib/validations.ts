import { z } from "zod/v4";

export const materialSchema = z.object({
  // Customer Info
  cust_name: z.string().min(1, "Customer Name is required"),
  cust_contact: z.string().optional().default(""),
  cust_address: z.string().optional().default(""),
  // Service Details
  service_type: z.enum(["warranty", "non_warranty", "doc", "amc", "rental"]).default("warranty"),
  product_name: z.string().min(1, "Product Name is required"),
  serial_number: z.string().optional().default(""),
  case_id: z.string().min(1, "Case ID is required"),
  condition_received: z.string().optional().default(""),
  arrival_date: z.string().nullable().optional(),
  delivery_date: z.string().nullable().optional(),
  // Issue
  issue_description: z.string().optional().default(""),
  // Part Details
  part_number: z.string().optional().default(""),
  part_usage: z.string().optional().default(""),
  failure_code: z.string().optional().default(""),
  part_description: z.string().optional().default(""),
  qty: z.coerce.number().min(1, "Quantity must be at least 1").default(1),
  ct_code: z.string().optional().default(""),
  so_req_id: z.string().optional().default(""),
  removed_part_sno: z.string().optional().default(""),
  installed_part_sno: z.string().optional().default(""),
  // Resolution & Engineer
  resolution_summary: z.string().optional().default(""),
  engineer_name: z.string().optional().default(""),
  hp_id: z.string().optional().default(""),
  call_status: z.enum(["pending", "closed", "taken_for_service"]).default("pending"),
  explanation: z.string().optional().default(""),
  customer_comments: z.string().optional().default(""),
});

export type MaterialFormData = z.infer<typeof materialSchema>;

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const transactionSchema = z.object({
  type: z.enum(["in", "out"]),
  material_id: z.string().min(1, "Select a material"),
  customer_id: z.string().min(1, "Select a customer"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
