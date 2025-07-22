
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { beneficiaryFormSchema as beneficiarySchema, type Beneficiary } from "@/lib/schemas/beneficiary-schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Gift } from "lucide-react";

interface AddBeneficiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (beneficiary: Beneficiary) => void;
  beneficiaryData: (Beneficiary & { index?: number }) | null;
}

const defaultValues: Beneficiary = {
  id: '',
  name: '',
  relationship: '',
};

export function AddBeneficiaryModal({ isOpen, onClose, onSave, beneficiaryData }: AddBeneficiaryModalProps) {
  const form = useForm<Beneficiary>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (beneficiaryData) {
      form.reset({ ...defaultValues, ...beneficiaryData });
    } else {
      form.reset(defaultValues);
    }
  }, [beneficiaryData, form, isOpen]);

  const onSubmit = (data: Beneficiary) => {
    const finalData = {
      ...data,
      id: beneficiaryData?.id || `ben-${Date.now()}`,
      index: beneficiaryData?.index,
    };
    onSave(finalData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            {beneficiaryData ? "Edit Beneficiary" : "Add a New Beneficiary"}
          </DialogTitle>
          <DialogDescription>
            Enter the details of the person or entity you wish to add as a beneficiary.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name or Entity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe or 'Hope Foundation'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship to You</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Friend, Nephew, Charity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-8 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Beneficiary</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
