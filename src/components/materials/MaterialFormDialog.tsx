import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { materialSchema, type MaterialFormData } from "@/lib/validations";
import type { Material } from "@/types";
import { SERVICE_TYPE_LABELS, CALL_STATUS_LABELS } from "@/types";
import { sendOTP, verifyOTPAndSubmit } from "@/api/materials";
import { toast } from "@/components/ui/use-toast";
import { Send, ShieldCheck, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";

type Step = "fill" | "review" | "otp" | "done";

interface MaterialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: Material | null;
  onSubmit: (data: MaterialFormData) => Promise<void>;
  onVerifiedSubmit?: () => void;
  loading?: boolean;
}

export function MaterialFormDialog({ open, onOpenChange, material, onSubmit, onVerifiedSubmit, loading }: MaterialFormDialogProps) {
  const [step, setStep] = useState<Step>("fill");
  const [smsLoading, setSmsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [submittedData, setSubmittedData] = useState<MaterialFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
  });

  useEffect(() => {
    if (open) {
      setStep("fill");
      setOtpValue("");
      setOtpError("");
      setSubmittedData(null);
    }

    if (material) {
      reset({
        cust_name: material.cust_name,
        cust_contact: material.cust_contact || "",
        cust_address: material.cust_address || "",
        service_type: material.service_type,
        product_name: material.product_name,
        serial_number: material.serial_number || "",
        case_id: material.case_id,
        condition_received: material.condition_received || "",
        arrival_date: material.arrival_date || null,
        delivery_date: material.delivery_date || null,
        issue_description: material.issue_description || "",
        part_number: material.part_number || "",
        part_usage: material.part_usage || "",
        failure_code: material.failure_code || "",
        part_description: material.part_description || "",
        qty: material.qty,
        ct_code: material.ct_code || "",
        so_req_id: material.so_req_id || "",
        removed_part_sno: material.removed_part_sno || "",
        installed_part_sno: material.installed_part_sno || "",
        resolution_summary: material.resolution_summary || "",
        engineer_name: material.engineer_name || "",
        hp_id: material.hp_id || "",
        call_status: material.call_status,
        explanation: material.explanation || "",
        customer_comments: material.customer_comments || "",
      });
    } else {
      reset({
        cust_name: "", cust_contact: "", cust_address: "",
        service_type: "warranty", product_name: "", serial_number: "",
        case_id: "", condition_received: "", arrival_date: null, delivery_date: null,
        issue_description: "",
        part_number: "", part_usage: "", failure_code: "", part_description: "",
        qty: 1, ct_code: "", so_req_id: "", removed_part_sno: "", installed_part_sno: "",
        resolution_summary: "", engineer_name: "", hp_id: "",
        call_status: "pending", explanation: "", customer_comments: "",
      });
    }
  }, [material, open, reset]);

  // Edit mode — direct submit
  const onEditSubmit = async (data: MaterialFormData) => {
    await onSubmit(data);
  };

  // Create Step 1: Validate form → move to review
  const handleSendToReview = (data: MaterialFormData) => {
    const phone = data.cust_contact?.replace(/\D/g, "") || "";
    if (!phone || phone.length < 10) {
      toast({ title: "Customer contact number is required for OTP verification", variant: "destructive" });
      return;
    }
    setSubmittedData(data);
    setStep("review");
  };

  // Review step → go back to edit
  const handleBackToEdit = () => {
    setStep("fill");
  };

  // Review step → send OTP via Fast2SMS
  const handleSendOTP = async () => {
    const phone = (submittedData?.cust_contact || getValues("cust_contact"))?.replace(/\D/g, "") || "";
    if (!phone || phone.length < 10) {
      toast({ title: "Invalid contact number", variant: "destructive" });
      return;
    }

    setSmsLoading(true);
    try {
      await sendOTP(phone);
      setStep("otp");
      setOtpValue("");
      setOtpError("");
      toast({ title: "OTP sent to customer's phone" });
    } catch (err: any) {
      toast({
        title: "Failed to send OTP",
        description: err.response?.data?.detail || "Please try again",
        variant: "destructive",
      });
    } finally {
      setSmsLoading(false);
    }
  };

  // OTP step → verify & submit
  const handleVerifyAndSubmit = async () => {
    if (otpValue.length < 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }

    const phone = (submittedData?.cust_contact || getValues("cust_contact"))?.replace(/\D/g, "") || "";
    const data = submittedData || getValues();

    setOtpLoading(true);
    setOtpError("");
    try {
      await verifyOTPAndSubmit(phone, otpValue, data as unknown as Record<string, unknown>);
      setStep("done");
      toast({ title: "Record submitted successfully" });
      setTimeout(() => {
        onOpenChange(false);
        onVerifiedSubmit?.();
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Verification failed";
      setOtpError(msg);
      toast({ title: msg, variant: "destructive" });
    } finally {
      setOtpLoading(false);
    }
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-4">
      {(["fill", "review", "otp", "done"] as Step[]).map((s, i) => {
        const labels = ["Fill Form", "Review", "Verify OTP", "Done"];
        const isActive = s === step;
        const isPast = (["fill", "review", "otp", "done"] as Step[]).indexOf(step) > i;
        return (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className={`h-px w-6 ${isPast ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`} />}
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
              isActive ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
              isPast ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
              "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
            }`}>
              {isPast && <CheckCircle2 className="w-3 h-3" />}
              {labels[i]}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Reusable form tabs
  const FormTabs = ({ disabled }: { disabled?: boolean }) => (
    <Tabs defaultValue="customer" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="customer">
          <span className="hidden sm:inline">Customer & Service</span>
          <span className="sm:hidden">Customer</span>
        </TabsTrigger>
        <TabsTrigger value="parts">
          <span className="hidden sm:inline">Part Details</span>
          <span className="sm:hidden">Parts</span>
        </TabsTrigger>
        <TabsTrigger value="resolution">
          <span className="hidden sm:inline">Resolution</span>
          <span className="sm:hidden">Status</span>
        </TabsTrigger>
        <TabsTrigger value="engineer">
          <span className="hidden sm:inline">Engineer & Notes</span>
          <span className="sm:hidden">Engineer</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="customer" className="space-y-4 min-h-[340px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Customer Name *</Label>
            <Input {...register("cust_name")} placeholder="Customer name" disabled={disabled} />
            {errors.cust_name && <p className="text-xs text-red-500">{errors.cust_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Contact Number *</Label>
            <Input {...register("cust_contact")} placeholder="Phone number" disabled={disabled} />
            {!material && <p className="text-xs text-slate-500">Required for OTP verification</p>}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Customer Address</Label>
            <Input {...register("cust_address")} placeholder="Full address" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>Service Type</Label>
            <select {...register("service_type")} disabled={disabled} className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 disabled:opacity-60">
              {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Product Name *</Label>
            <Input {...register("product_name")} placeholder="e.g. HP Laptop, Printer" disabled={disabled} />
            {errors.product_name && <p className="text-xs text-red-500">{errors.product_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Serial Number</Label>
            <Input {...register("serial_number")} placeholder="Serial number" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>Case ID *</Label>
            <Input {...register("case_id")} placeholder="Case ID" disabled={disabled} />
            {errors.case_id && <p className="text-xs text-red-500">{errors.case_id.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Condition Received</Label>
            <Input {...register("condition_received")} placeholder="Physical condition on arrival" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>Arrival Date</Label>
            <Input type="date" {...register("arrival_date")} disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>Delivery Date</Label>
            <Input type="date" {...register("delivery_date")} disabled={disabled} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Issue Description</Label>
            <Input {...register("issue_description")} placeholder="Describe the issue reported by customer..." disabled={disabled} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="parts" className="space-y-4 min-h-[340px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Product/Part No.</Label>
            <Input {...register("part_number")} placeholder="Part number" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>Part Usage</Label>
            <Input {...register("part_usage")} placeholder="Usage details" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>Failure Code</Label>
            <Input {...register("failure_code")} placeholder="Failure code" disabled={disabled} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Part Description</Label>
            <Input {...register("part_description")} placeholder="Part description" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>Quantity *</Label>
            <Input type="number" {...register("qty", { valueAsNumber: true })} disabled={disabled} />
            {errors.qty && <p className="text-xs text-red-500">{errors.qty.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>CT Code</Label>
            <Input {...register("ct_code")} placeholder="CT Code" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>So. No./Req ID</Label>
            <Input {...register("so_req_id")} placeholder="SO number or Request ID" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>Removed Part S.No.</Label>
            <Input {...register("removed_part_sno")} placeholder="Serial no. of removed part" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>Installed Part S.No.</Label>
            <Input {...register("installed_part_sno")} placeholder="Serial no. of installed part" disabled={disabled} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="resolution" className="space-y-4 min-h-[340px]">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Resolution Summary</Label>
            <textarea
              {...register("resolution_summary")}
              placeholder="Describe the resolution..."
              disabled={disabled}
              className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 disabled:opacity-60"
            />
          </div>
          <div className="space-y-2">
            <Label>Call Status</Label>
            <select {...register("call_status")} disabled={disabled} className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 disabled:opacity-60">
              {Object.entries(CALL_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Explanation</Label>
            <textarea
              {...register("explanation")}
              placeholder="Additional explanation..."
              disabled={disabled}
              className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 disabled:opacity-60"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="engineer" className="space-y-4 min-h-[340px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Engineer Name</Label>
            <Input {...register("engineer_name")} placeholder="Engineer name" disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label>HP ID</Label>
            <Input {...register("hp_id")} placeholder="HP employee ID" disabled={disabled} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Customer Comments</Label>
            <textarea
              {...register("customer_comments")}
              placeholder="Customer feedback or comments..."
              disabled={disabled}
              className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 disabled:opacity-60"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  // ========== EDIT MODE — simple flow ==========
  if (material) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-6 pt-4">
            <FormTabs />
            <DialogFooter className="border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={loading} className="w-24">
                {loading ? "Saving..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // ========== CREATE MODE — multi-step OTP flow ==========
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setStep("fill"); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Service Record</DialogTitle>
        </DialogHeader>

        <StepIndicator />

        {/* STEP 1: FILL — staff fills the form */}
        {step === "fill" && (
          <form onSubmit={handleSubmit(handleSendToReview)} className="space-y-6">
            <FormTabs />
            <DialogFooter className="border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="gap-2">
                <Send className="w-4 h-4" />
                Send to Customer
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* STEP 2: REVIEW — customer reviews details on screen */}
        {step === "review" && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
              <Send className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-blue-800 dark:text-blue-200">Show details to customer for review</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                If changes are needed, click "Edit". Once confirmed, click "Send OTP" to verify.
              </p>
            </div>

            <FormTabs disabled />

            <DialogFooter className="border-t pt-4 flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={handleBackToEdit} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Edit
              </Button>
              <Button type="button" onClick={handleSendOTP} disabled={smsLoading} className="gap-2">
                {smsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {smsLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* STEP 3: OTP — enter OTP for verification */}
        {step === "otp" && (
          <div className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
              <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <p className="font-medium text-amber-800 dark:text-amber-200">OTP Verification</p>
              <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                A 6-digit OTP has been sent to <strong>{submittedData?.cust_contact}</strong>
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Ask the customer to share the OTP and enter it below.
              </p>

              <div className="mt-6 max-w-xs mx-auto">
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otpValue}
                  onChange={(e) => {
                    setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setOtpError("");
                  }}
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                />
                {otpError && <p className="text-xs text-red-500 mt-2">{otpError}</p>}
              </div>

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={smsLoading}
                className="text-sm text-blue-600 dark:text-blue-400 underline mt-3 hover:no-underline disabled:opacity-50"
              >
                {smsLoading ? "Sending..." : "Resend OTP"}
              </button>
            </div>

            <DialogFooter className="border-t pt-4 flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("review")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="button" onClick={handleVerifyAndSubmit} disabled={otpLoading || otpValue.length < 6} className="gap-2">
                {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {otpLoading ? "Verifying..." : "Verify & Submit"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* STEP 4: DONE — success */}
        {step === "done" && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-semibold text-green-700 dark:text-green-300">Record Submitted Successfully</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              The record has been saved to the database.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
