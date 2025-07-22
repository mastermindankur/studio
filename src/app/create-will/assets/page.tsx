
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { ChevronRight, PlusCircle, Trash2, Edit, Landmark, Home, Car, AreaChart, ShieldCheck, Gem } from "lucide-react";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription as AlertDesc } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AddAssetModal } from "@/components/create-will/add-asset-modal";
import { assetFormSchema as assetSchema, type Asset } from "@/lib/schemas/asset-schema";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useRouter } from "next/navigation";

const assetsFormSchema = z.object({
  assets: z.array(assetSchema),
});

type AssetsFormValues = z.infer<typeof assetsFormSchema>;

const assetIcons: { [key: string]: React.ElementType } = {
  "Bank Account": Landmark,
  "Real Estate": Home,
  "Vehicle": Car,
  "Stocks/Investments": AreaChart,
  "Insurance Policy": ShieldCheck,
  "Jewelry/Valuables": Gem,
  "Other": PlusCircle,
};

export default function AssetsPage() {
  const { formData, setDirty, loading, addAsset, updateAsset, removeAsset } = useWillForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const router = useRouter();

  const form = useForm<AssetsFormValues>({
    defaultValues: { assets: [] },
  });
  
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "assets",
    keyName: "formId",
  });

  useEffect(() => {
    if (!loading && formData.assets?.assets) {
        form.reset({ assets: formData.assets.assets });
    }
  }, [loading, formData.assets, form]);


  const { version, createdAt } = formData;
  const isEditingWill = !!version;

  function onSubmit(data: AssetsFormValues) {
    // This navigation is now just a simple "go to next page" as saves are instant
    router.push("/create-will/beneficiaries");
  }

  const handleAddNewAsset = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
  };
  
  const handleEditAsset = (index: number) => {
    const assetToEdit = form.getValues().assets[index];
    setEditingAsset({ ...assetToEdit, index });
    setIsModalOpen(true);
  };

  const handleSaveAsset = async (asset: Asset) => {
    if (asset.index !== undefined && asset.id) {
      // This is an update
      await updateAsset(asset); // This now saves to DB
      const { index, ...assetData } = asset;
      update(index, assetData);
    } else {
      // This is a new asset
      const newId = await addAsset(asset); // This now saves to DB and returns an ID
      if (newId) {
        append({ ...asset, id: newId });
      }
    }
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleRemoveAsset = async (index: number) => {
    const assetId = form.getValues().assets[index].id;
    if (assetId) {
      await removeAsset(assetId); // This now deletes from DB
      remove(index);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
            <Skeleton className="h-9 w-1/2 mx-auto" />
            <Skeleton className="h-5 w-1/3 mx-auto mt-2" />
          </div>
          <Skeleton className="h-20 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
          <div className="flex justify-end mt-8">
            <Skeleton className="h-11 w-44" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AddAssetModal
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setEditingAsset(null);
        }}
        onSave={handleSaveAsset}
        assetData={editingAsset}
      />
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
            <Landmark className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Your Assets</h1>
            {isEditingWill && (
              <p className="text-foreground/80 mt-2">
                Editing Will Version {version} (created on {createdAt ? format(new Date(createdAt), "PPP") : 'N/A'})
              </p>
            )}
        </div>
         <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>List Your Assets</AlertTitle>
            <AlertDesc>
              Clearly listing all your assets ensures there is no ambiguity. This makes it easier for your executor to distribute your property as you intended. Click "Add Asset" to get started. Your changes are saved automatically.
            </AlertDesc>
          </Alert>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((asset, index) => {
                const Icon = assetIcons[asset.type] || PlusCircle;
                return (
                <Card key={asset.formId} className="overflow-hidden flex flex-col">
                   <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
                     <div className="flex items-center gap-3 truncate">
                        <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <CardTitle className="text-lg font-semibold text-primary truncate">
                            {asset.details?.description || asset.type}
                        </CardTitle>
                     </div>
                        <div className="flex gap-1">
                            <Button type="button" variant="ghost" size="icon" className="text-primary hover:bg-primary/10 h-8 w-8" onClick={() => handleEditAsset(index)}><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                            <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8" onClick={() => handleRemoveAsset(index)}><Trash2 className="h-4 w-4" /><span className="sr-only">Remove</span></Button>
                        </div>
                   </CardHeader>
                   <CardContent className="p-6 space-y-4 flex-grow">
                        <div>
                            <p className="text-sm text-muted-foreground">Type</p>
                            <p className="font-semibold">{asset.type}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Estimated Value</p>
                            <p className="font-semibold">{asset.details?.value ? `₹${new Intl.NumberFormat('en-IN').format(Number(asset.details.value))}` : "N/A"}</p>
                        </div>
                   </CardContent>
                </Card>
                )
              })}
               <Card className="border-dashed border-2 hover:border-primary hover:text-primary transition-colors duration-200 flex items-center justify-center min-h-[250px]">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-full text-lg"
                  onClick={handleAddNewAsset}
                >
                  <PlusCircle className="mr-2 h-6 w-6" />
                  Add Asset
                </Button>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Continue to Beneficiaries
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
