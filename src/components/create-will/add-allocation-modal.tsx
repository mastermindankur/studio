
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { PlusCircle, Trash2 } from "lucide-react";
import { Alert, AlertCircle } from "lucide-react";
import { Alert as UIAlert, AlertTitle, AlertDescription as UIAlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";


interface AddAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetId: string, allocations: any[]) => void;
  unallocatedAssets: any[];
  allBeneficiaries: any[];
  familyDetails: any;
  initialAssetId?: string;
  initialAllocations?: any[];
}

const allocationSchema = z.object({
  id: z.string().optional(),
  beneficiaryId: z.string().min(1, "Beneficiary is required."),
  percentage: z.coerce.number()
    .min(0.01, "Percentage must be > 0.")
    .max(100, "Percentage must be <= 100."),
});

const formSchema = z.object({
  assetId: z.string().min(1, "Please select an asset to allocate."),
  allocations: z.array(allocationSchema),
}).refine(data => {
    const totalPercentage = data.allocations.reduce((sum, alloc) => sum + (alloc.percentage || 0), 0);
    return totalPercentage <= 100;
}, {
    message: "Total allocation cannot exceed 100%.",
    path: ["allocations"],
});


export function AddAllocationModal({
  isOpen,
  onClose,
  onSave,
  unallocatedAssets,
  allBeneficiaries,
  familyDetails,
  initialAssetId,
  initialAllocations = []
}: AddAllocationModalProps) {

  const combinedBeneficiaries = useMemo(() => {
    const beneficiariesMap = new Map();
    allBeneficiaries.forEach(b => beneficiariesMap.set(b.id, { id: b.id, name: b.name }));
    if (familyDetails?.spouseName) {
      const spouseId = `spouse-${familyDetails.spouseName.replace(/\s+/g, '-').toLowerCase()}`;
      beneficiariesMap.set(spouseId, { id: spouseId, name: `${familyDetails.spouseName} (Spouse)` });
    }
    familyDetails?.children?.forEach((c: any) => {
      if (c.name) {
        const childId = `child-${c.name.replace(/\s+/g, '-').toLowerCase()}`;
        beneficiariesMap.set(childId, { id: childId, name: `${c.name} (Child)` });
      }
    });
    return Array.from(beneficiariesMap.values());
  }, [allBeneficiaries, familyDetails]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetId: initialAssetId || "",
      allocations: initialAllocations.length > 0 ? initialAllocations : [{ beneficiaryId: "", percentage: 100 }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "allocations",
  });
  
  const watchAllocations = form.watch("allocations");
  const totalAllocated = useMemo(() => {
    return watchAllocations.reduce((sum, alloc) => sum + (alloc.percentage || 0), 0);
  }, [watchAllocations]);


  useEffect(() => {
    if (isOpen) {
      form.reset({
        assetId: initialAssetId || "",
        allocations: initialAllocations.length > 0 ? initialAllocations : [{ beneficiaryId: "", percentage: 100 }],
      });
    }
  }, [isOpen, initialAssetId, initialAllocations, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const allocationsWithIds = data.allocations.map((alloc, index) => ({
      ...alloc,
      assetId: data.assetId,
      id: alloc.id || `alloc-${Date.now()}-${index}`,
    }));
    onSave(data.assetId, allocationsWithIds);
    onClose();
  };

  const availableAssets = initialAssetId 
    ? [...unallocatedAssets, ...unallocatedAssets.find(a => a.id === initialAssetId) ? [] : [{id: initialAssetId, details: {description: 'Existing Asset'}}]]
    : unallocatedAssets;
  
  const assetName = form.watch("assetId") ? allBeneficiaries.find(a => a.id === form.watch("assetId"))?.details?.description : 'New Allocation';


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialAssetId ? 'Edit Allocation' : 'Add New Allocation'}
          </DialogTitle>
          <DialogDescription>
            Select an asset and assign shares to beneficiaries. The total shares cannot exceed 100%.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] p-1">
              <div className="space-y-6 p-5">
                <FormField
                  control={form.control}
                  name="assetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset to Allocate</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialAssetId}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an asset" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {initialAssetId && <SelectItem value={initialAssetId}>Edit Current Asset</SelectItem>}
                          {unallocatedAssets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.details.description || asset.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 pt-4 border-t">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_auto_auto] items-end gap-4 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`allocations.${index}.beneficiaryId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beneficiary</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select beneficiary" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {combinedBeneficiaries.map((b) => (
                                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`allocations.${index}.percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Share (%)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g. 50" {...field} className="w-28" />
                            </FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                 <Button type="button" variant="outline" size="sm" onClick={() => append({ beneficiaryId: "", percentage: 0 })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Beneficiary
                 </Button>

                {form.formState.errors.allocations && (
                    <UIAlert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Allocation Error</AlertTitle>
                        <UIAlertDescription>{form.formState.errors.allocations.message}</UIAlertDescription>
                    </UIAlert>
                )}
                 {totalAllocated > 100 && (
                     <UIAlert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Over-allocated!</AlertTitle>
                        <UIAlertDescription>Total allocation is {totalAllocated}%. Please reduce to 100% or less.</UIAlertDescription>
                    </UIAlert>
                 )}

              </div>
            </ScrollArea>
            <DialogFooter className="mt-6 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Allocation</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
