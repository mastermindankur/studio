
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ChevronLeft, PlusCircle, Trash2, PieChart, Info, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect, useMemo } from "react";
import { format } from "date-fns";

const allocationSchema = z.object({
  assetId: z.string({ required_error: "Please select an asset." }),
  beneficiaryId: z.string({ required_error: "Please select a beneficiary." }),
  percentage: z.coerce.number()
    .min(1, "Percentage must be at least 1.")
    .max(100, "Percentage cannot exceed 100."),
});

const assetAllocationFormSchema = z.object({
  allocations: z.array(allocationSchema),
}).refine(data => {
    const assetTotals: { [key: string]: number } = {};
    for (const alloc of data.allocations) {
        if (!assetTotals[alloc.assetId]) {
            assetTotals[alloc.assetId] = 0;
        }
        assetTotals[alloc.assetId] += alloc.percentage;
    }
    for (const assetId in assetTotals) {
        if (assetTotals[assetId] > 100) {
            return false;
        }
    }
    return true;
}, {
    message: "Total allocation for an asset cannot exceed 100%.",
    path: ["allocations"],
});


type AssetAllocationFormValues = z.infer<typeof assetAllocationFormSchema>;

export default function AssetAllocationPage() {
  const { formData, saveAndGoTo, setDirty } = useWillForm();

  const MOCK_ASSETS = formData.assets?.assets || [];
  
  const combinedBeneficiaries = useMemo(() => {
    const allBeneficiaries = new Map();

    // Add from beneficiaries step (they have explicit IDs)
    formData.beneficiaries?.beneficiaries?.forEach(b => {
      if (b.id && b.name) {
        allBeneficiaries.set(b.id, { id: b.id, name: b.name });
      }
    });

    // Add spouse from family details
    if (formData.familyDetails?.spouseName) {
        const spouseId = `spouse-${formData.familyDetails.spouseName.replace(/\s+/g, '-').toLowerCase()}`;
        if (!allBeneficiaries.has(spouseId)) {
            allBeneficiaries.set(spouseId, { id: spouseId, name: `${formData.familyDetails.spouseName} (Spouse)` });
        }
    }

    // Add children from family details
    formData.familyDetails?.children?.forEach(c => {
        if (c.name) {
            const childId = `child-${c.name.replace(/\s+/g, '-').toLowerCase()}`;
            if (!allBeneficiaries.has(childId)) {
                allBeneficiaries.set(childId, { id: childId, name: `${c.name} (Child)` });
            }
        }
    });

    return Array.from(allBeneficiaries.values());
  }, [formData.beneficiaries, formData.familyDetails]);


  const form = useForm<AssetAllocationFormValues>({
    resolver: zodResolver(assetAllocationFormSchema),
    defaultValues: formData.assetAllocation || { allocations: [{ assetId: "", beneficiaryId: "", percentage: 100 }] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "allocations",
  });
  
  const { version, createdAt } = formData;
  const isEditing = !!version;

  useEffect(() => {
    const subscription = form.watch(() => setDirty(true));
    return () => subscription.unsubscribe();
  }, [form, setDirty]);

  function onSubmit(data: AssetAllocationFormValues) {
    saveAndGoTo(data, "/create-will/executor");
  }

  function handleBack() {
    saveAndGoTo(form.getValues(), "/create-will/beneficiaries");
  }

  function handleSaveAndExit(data: AssetAllocationFormValues) {
    saveAndGoTo(data, "/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg mt-8">
        <div className="text-center mb-8">
            <PieChart className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Asset Allocation</h1>
            {isEditing ? (
              <p className="text-foreground/80 mt-2">
                Editing Will Version {version} (created on {createdAt ? format(new Date(createdAt), "PPP") : 'N/A'})
              </p>
            ) : (
              <p className="text-foreground/80">Step 5 of 7</p>
            )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>How to Allocate Assets</AlertTitle>
              <AlertDescription>
                This is where you decide who gets what. Assign a percentage of each asset to your chosen beneficiaries. The total for each asset cannot exceed 100%. Any unallocated portion will be handled by the residuary clause of your will.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-6 border rounded-lg relative">
                  <div className="grid md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name={`allocations.${index}.assetId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an asset" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MOCK_ASSETS.map((asset: any) => (
                                <SelectItem key={asset.id} value={asset.id!}>{asset.description}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`allocations.${index}.beneficiaryId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beneficiary</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a beneficiary" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {combinedBeneficiaries.map((ben: any) => (
                                <SelectItem key={ben.id} value={ben.id!}>{ben.name}</SelectItem>
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
                            <Input type="number" min="1" max="100" placeholder="e.g., 50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove allocation</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {form.formState.errors.allocations && (
                <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.allocations.message}
                </p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ assetId: "", beneficiaryId: "", percentage: 100 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Allocation
            </Button>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button type="button" size="lg" variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous Step
              </Button>
              <Button type="button" size="lg" variant="secondary" onClick={form.handleSubmit(handleSaveAndExit)} className="w-full sm:w-auto">
                  <Save className="mr-2 h-5 w-5" /> Save & Exit
              </Button>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Next Step <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
