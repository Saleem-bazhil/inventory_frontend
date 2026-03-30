import { z } from "zod/v4";

export const materialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category: z.enum(["Raw Material", "Packaging", "Finished Good", "Component", "Consumable"]),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  min_stock: z.coerce.number().min(0, "Min stock cannot be negative"),
  unit: z.enum(["kg", "pcs", "liters", "meters", "boxes"]),
  unit_price: z.coerce.number().positive("Price must be greater than 0"),
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
  email: z.string().email("Invalid email address"),
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
