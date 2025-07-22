
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChevronRight, PlusCircle, PieChart } from "lucide-react";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { AddAllocationModal } from "@/components/create-will/add-allocation-modal";
import { AssetAllocationCard } from "@/components/create-will/asset-allocation-card";
import { Card } from "@/components/ui/card";

const allocationSchema = z.object({
  id: z.string().optional(),
  assetId: z.string(),
  beneficiaryId: z.string(),
  percentage: z.coerce.number()
    .min(0.01, "Percentage must be greater than 0.")
    .max(100, "Percentage cannot exceed 100."),
});

const assetAllocationFormSchema = z.object({
  allocations: z.array(allocationSchema),
});

type AssetAllocationFormValues = z.infer<typeof assetAllocationFormSchema>;

export default function AssetAllocationPage() {
  const { formData, saveAndGoTo, setDirty, loading, updateAllocations } = useWillForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllocations, setEditingAllocations] = useState<{ assetId: string, allocations: any[] } | null>(null);
  const router = useRouter();

  const form = useForm<AssetAllocationFormValues>({
    defaultValues: { allocations: [] },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "allocations",
    keyName: "formId",
  });

  useEffect(() => {
    if (!loading && formData.assetAllocation?.allocations) {
      form.reset({ allocations: formData.assetAllocation.allocations });
    }
  }, [loading, formData.assetAllocation, form]);

  const { version, createdAt } = formData;
  const isEditing = !!version;

  const allAssets = formData.assets?.assets || [];
  const watchedAllocations = form.watch("allocations");

  const allocatedAssets = useMemo(() => {
    return (watchedAllocations || []).reduce((acc, alloc) => {
      if (!alloc.assetId) return acc;
      if (!acc[alloc.assetId]) {
        acc[alloc.assetId] = [];
      }
      acc[alloc.assetId].push(alloc);
      return acc;
    }, {} as { [key: string]: any[] });
  }, [watchedAllocations]);
  
  const unallocatedAssets = useMemo(() => {
    const allocatedAssetIds = Object.keys(allocatedAssets);
    return allAssets.filter(asset => !allocatedAssetIds.includes(asset.id!));
  }, [allAssets, allocatedAssets]);


  const handleSaveAllocations = async (assetId: string, newAllocations: any[]) => {
    // Remove all old allocations for this asset
    const currentAllocations = form.getValues().allocations;
    const otherAllocations = currentAllocations.filter(a => a.assetId !== assetId);
    
    // Add the new allocations
    const updatedAllocations = [...otherAllocations, ...newAllocations];
    
    // Save to database and update context state
    await updateAllocations(updatedAllocations);
    
    // Update local form state to match context
    form.setValue('allocations', updatedAllocations, { shouldDirty: false });
    
    setIsModalOpen(false);
    setEditingAllocations(null);
  };

  const handleRemoveAssetAllocation = async (assetId: string) => {
    const currentAllocations = form.getValues().allocations;
    const remainingAllocations = currentAllocations.filter(a => a.assetId !== assetId);
    await updateAllocations(remainingAllocations);
    form.setValue('allocations', remainingAllocations, { shouldDirty: false });
  }

  const handleEditAllocation = (assetId: string) => {
    const allocations = allocatedAssets[assetId] || [];
    setEditingAllocations({ assetId, allocations });
    setIsModalOpen(true);
  };
  
  const handleAddAllocation = () => {
    setEditingAllocations(null); // Explicitly set to null for new allocation
    setIsModalOpen(true);
  };

  function onSubmit(data: AssetAllocationFormValues) {
    // This is now purely for navigation, as saves are instant
    router.push("/create-will/executor");
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
            <Skeleton className="h-9 w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {isModalOpen && (
          <AddAllocationModal
            key={editingAllocations ? editingAllocations.assetId : 'new'}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveAllocations}
            unallocatedAssets={unallocatedAssets}
            allBeneficiaries={formData.beneficiaries?.beneficiaries || []}
            familyDetails={formData.familyDetails}
            initialData={editingAllocations}
          />
      )}
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <PieChart className="w-12 h-12 text-primary mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-primary font-headline">Asset Allocation</h1>
          {isEditing && (
            <p className="text-foreground/80 mt-2">
              Editing Will Version {version} (created on {createdAt ? format(new Date(createdAt), "PPP") : 'N/A'})
            </p>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(allocatedAssets).map(([assetId, allocations]) => {
                const assetDetails = allAssets.find(a => a.id === assetId);
                if (!assetDetails) return null;
                return (
                  <AssetAllocationCard
                    key={assetId}
                    asset={assetDetails}
                    allocations={allocations}
                    onEdit={() => handleEditAllocation(assetId)}
                    onRemove={() => handleRemoveAssetAllocation(assetId)}
                    allBeneficiaries={formData.beneficiaries?.beneficiaries || []}
                    familyDetails={formData.familyDetails}
                  />
                );
              })}
              <Card className="border-dashed border-2 hover:border-primary hover:text-primary transition-colors duration-200 flex items-center justify-center min-h-[250px]">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-full text-lg"
                  onClick={handleAddAllocation}
                  disabled={unallocatedAssets.length === 0}
                >
                  <PlusCircle className="mr-2 h-6 w-6" />
                  {unallocatedAssets.length === 0 ? "All Assets Allocated" : "Allocate Another Asset"}
                </Button>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Continue to Executor <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
