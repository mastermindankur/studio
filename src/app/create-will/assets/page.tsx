
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { ChevronRight, PlusCircle, Trash2, Landmark, Edit } from "lucide-react";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription as AlertDesc } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AddAssetModal } from "@/components/create-will/add-asset-modal";
import { assetSchema, type Asset } from "@/lib/schemas/asset-schema";

const assetsFormSchema = z.object({
  assets: z.array(assetSchema),
});

type AssetsFormValues = z.infer<typeof assetsFormSchema>;


export default function AssetsPage() {
  const { formData, saveAndGoTo, setDirty, loading } = useWillForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const form = useForm<AssetsFormValues>({
    defaultValues: { assets: [] },
  });
  
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "assets",
  });

  useEffect(() => {
    if (!loading && formData.assets?.assets) {
        form.reset({ assets: formData.assets.assets });
    }
  }, [loading, formData.assets, form]);


  const { version, createdAt } = formData;
  const isEditingWill = !!version;

  useEffect(() => {
    const subscription = form.watch(() => setDirty(true));
    return () => subscription.unsubscribe();
  }, [form, setDirty]);

  function onSubmit(data: AssetsFormValues) {
    const assetsWithIds = data.assets.map((asset, index) => ({
        ...asset,
        id: asset.id || `asset-${Date.now()}-${index}`,
    }));
    saveAndGoTo('assets', { assets: assetsWithIds }, "/create-will/assets/review");
  }

  const handleAddNewAsset = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
  };
  
  const handleEditAsset = (index: number) => {
    setEditingAsset({ ...form.getValues().assets[index], index });
    setIsModalOpen(true);
  };

  const handleSaveAsset = (asset: Asset) => {
    if (asset.index !== undefined) {
      const { index, ...assetData } = asset;
      update(index, assetData);
    } else {
      append(asset);
    }
    setDirty(true);
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleRemoveAsset = (index: number) => {
    remove(index);
    setDirty(true);
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
              Clearly listing all your assets ensures there is no ambiguity. This makes it easier for your executor to distribute your property as you intended. Click "Add Asset" to get started.
            </AlertDesc>
          </Alert>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((asset, index) => (
                <Card key={asset.id} className="overflow-hidden flex flex-col">
                   <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
                     <CardTitle className="text-lg font-semibold text-primary truncate">
                       {asset.details.description || asset.type}
                     </CardTitle>
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" size="icon" className="text-primary hover:bg-primary/10" onClick={() => handleEditAsset(index)}><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                            <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleRemoveAsset(index)}><Trash2 className="h-4 w-4" /><span className="sr-only">Remove</span></Button>
                        </div>
                   </CardHeader>
                   <CardContent className="p-6 space-y-4 flex-grow">
                        <div>
                            <p className="text-sm text-muted-foreground">Type</p>
                            <p className="font-semibold">{asset.type}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Estimated Value</p>
                            <p className="font-semibold">{asset.details.value ? `₹${new Intl.NumberFormat('en-IN').format(Number(asset.details.value))}` : "N/A"}</p>
                        </div>
                   </CardContent>
                </Card>
              ))}
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
                Save & Continue
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
