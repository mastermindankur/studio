
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
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, PlusCircle, Trash2, Landmark } from "lucide-react";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription as AlertDesc } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { format } from "date-fns";


const assetSchema = z.object({
  id: z.string().optional(), // Keep track of asset for allocation
  type: z.string({ required_error: "Please select an asset type." }),
  description: z.string().min(10, "Description must be at least 10 characters."),
  value: z.string().regex(/^\d+$/, "Value must be a number.").optional(),
});

const assetsFormSchema = z.object({
  assets: z.array(assetSchema),
});

type AssetsFormValues = z.infer<typeof assetsFormSchema>;

const assetTypes = [
  "Bank Account",
  "Real Estate (Flat, House, Land)",
  "Vehicle (Car, Motorcycle)",
  "Jewelry & Valuables",
  "Stocks & Investments",
  "Insurance Policy",
  "Other",
];

const descriptionPlaceholders: { [key: string]: string } = {
  "Bank Account": "e.g., HDFC Bank Savings A/C No. XXXXXX, IFSC, Branch Name.",
  "Real Estate (Flat, House, Land)": "e.g., 2BHK Flat at [Full Address], Survey No, and dimensions.",
  "Vehicle (Car, Motorcycle)": "e.g., Honda City, Reg No. TS09XX1234, Chassis No.",
  "Jewelry & Valuables": "e.g., 50g Gold Necklace, Diamond Ring, with identifying marks.",
  "Stocks & Investments": "e.g., 100 shares of Reliance Industries, Demat A/C No. with Zerodha.",
  "Insurance Policy": "e.g., LIC Jeevan Anand, Policy No. XXXXXXX, Sum Assured.",
  "Other": "Provide any specific details to clearly identify the asset.",
};


export default function AssetsPage() {
  const { formData, saveAndGoTo, setDirty, loading } = useWillForm();

  const form = useForm<AssetsFormValues>({
    resolver: zodResolver(assetsFormSchema),
    defaultValues: { assets: formData.assets },
  });

  useEffect(() => {
    if (!loading && formData.assets) {
        form.reset({ assets: formData.assets });
    }
  }, [loading, formData.assets, form]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assets",
  });
  
  const { version, createdAt } = formData;
  const isEditing = !!version;

  const watchedAssets = form.watch("assets");

  useEffect(() => {
    const subscription = form.watch(() => setDirty(true));
    return () => subscription.unsubscribe();
  }, [form, setDirty]);

  function onSubmit(data: AssetsFormValues) {
    const assetsWithIds = data.assets.map((asset, index) => ({
        ...asset,
        id: asset.id || `asset-${Date.now()}-${index}`,
    }));
    saveAndGoTo('assets', assetsWithIds, "/create-will/beneficiaries");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
            <Landmark className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Your Assets</h1>
            {isEditing && (
              <p className="text-foreground/80 mt-2">
                Editing Will Version {version} (created on {createdAt ? format(new Date(createdAt), "PPP") : 'N/A'})
              </p>
            )}
        </div>
         <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Why list your assets?</AlertTitle>
            <AlertDesc>
              Clearly listing all your assets ensures there is no ambiguity. This makes it easier for your executor to distribute your property as you intended.
            </AlertDesc>
          </Alert>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {fields.map((field, index) => {
                const selectedType = watchedAssets?.[index]?.type;
                const descriptionText = selectedType ? descriptionPlaceholders[selectedType] : "Provide specific details to identify the asset.";

                return (
                <div key={field.id} className="p-6 border rounded-lg relative">
                   <div className="grid md:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name={`assets.${index}.type`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Asset Type</FormLabel>
                             <p className="text-[0.8rem] text-muted-foreground">
                                Select the category of the asset.
                              </p>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an asset type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {assetTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name={`assets.${index}.value`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Estimated Value (in ₹)</FormLabel>
                             <p className="text-[0.8rem] text-muted-foreground">
                                An approximate current market value.
                              </p>
                            <FormControl>
                                <Input type="text" inputMode="numeric" placeholder="e.g., 500000" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                   </div>
                  <FormField
                    control={form.control}
                    name={`assets.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Asset Description</FormLabel>
                        <FormDescription>
                          {descriptionText}
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder={descriptionText}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove asset</span>
                    </Button>
                  )}
                </div>
              )})}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ type: "", description: "", value: "" })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Asset
            </Button>
            
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Save & Continue <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
