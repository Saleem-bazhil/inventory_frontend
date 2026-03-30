import { z } from "zod/v4";

export const materialSchema = z.object({
  cust_name: z.string().min(1, "Customer Name is required"),
  cust_contact: z.string().min(1, "Customer Contact is required"),
  case_id: z.string().min(1, "Case ID is required"),
  so_number: z.string().min(1, "SO Number is required"),
  warranty: z.boolean().optional(),
  issue: z.string().min(1, "Issue is required"),
  product: z.string().min(1, "Product is required"),
  model_name: z.string().min(1, "Model Name is required"),
  part_number: z.string().min(1, "Part Number is required"),
  serial_number: z.string().min(1, "Serial Number is required"),
  qty: z.coerce.number().min(1, "Quantity must be at least 1"),
  hp_part_in_date: z.string().nullable().optional(),
  aging: z.coerce.number().nullable().optional(),
  out_date: z.string().nullable().optional(),
  collector: z.string().optional(),
  in_date: z.string().nullable().optional(),
  receiver: z.string().optional(),
  used_part: z.boolean().optional(),
  remarks: z.string().optional(),
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
