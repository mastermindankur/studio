
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, PlusCircle, Trash2, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";

const assetSchema = z.object({
  type: z.string({ required_error: "Please select an asset type." }),
  description: z.string().min(10, "Description must be at least 10 characters."),
  value: z.string().regex(/^\d+$/, "Value must be a number."),
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

export default function AssetsPage() {
  const router = useRouter();
  const form = useForm<AssetsFormValues>({
    resolver: zodResolver(assetsFormSchema),
    defaultValues: {
      assets: [{ type: "", description: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assets",
  });

  function onSubmit(data: AssetsFormValues) {
    console.log(data);
    // TODO: Save data to global state
    // router.push("/create-will/beneficiaries"); // Navigate to next step
  }
  
  function handleBack() {
    router.push("/create-will/family-details");
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Landmark className="w-12 h-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-primary font-headline">Create Your Will</h1>
        <p className="text-foreground/80">Step 3 of 6: Your Assets</p>
      </div>
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-6 border rounded-lg relative">
                   <div className="grid md:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name={`assets.${index}.type`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Asset Type</FormLabel>
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
                            <FormLabel>Current Value (in ₹)</FormLabel>
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
                        <FormControl>
                          <Textarea
                            placeholder="e.g., HDFC Bank Savings A/C No. XXXXXX, or 2BHK Flat at Address..."
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
              ))}
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
            
            <div className="flex justify-between mt-8">
              <Button type="button" size="lg" variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous Step
              </Button>
              <Button type="submit" size="lg">
                Next Step <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
