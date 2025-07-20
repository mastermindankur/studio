
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
import { ChevronRight, ChevronLeft, PlusCircle, Trash2, Gift, Users, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect } from "react";

const beneficiarySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Beneficiary's name must be at least 2 characters."),
  relationship: z.string().min(2, "Relationship must be at least 2 characters."),
});

const beneficiariesFormSchema = z.object({
  beneficiaries: z.array(beneficiarySchema),
});

type BeneficiariesFormValues = z.infer<typeof beneficiariesFormSchema>;

export default function BeneficiariesPage() {
  const { formData, saveAndGoTo, setDirty } = useWillForm();

  const form = useForm<BeneficiariesFormValues>({
    resolver: zodResolver(beneficiariesFormSchema),
    defaultValues: formData.beneficiaries,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "beneficiaries",
  });

  useEffect(() => {
    const subscription = form.watch(() => setDirty(true));
    return () => subscription.unsubscribe();
  }, [form, setDirty]);

  function onSubmit(data: BeneficiariesFormValues) {
    const beneficiariesWithIds = {
      beneficiaries: data.beneficiaries.map((ben, index) => ({
        ...ben,
        id: ben.id || `ben-${Date.now()}-${index}`,
      }))
    };
    saveAndGoTo(beneficiariesWithIds, "/create-will/asset-allocation");
  }

  function handleBack() {
    saveAndGoTo(form.getValues(), "/create-will/assets");
  }

  function handleSaveAndExit(data: BeneficiariesFormValues) {
    const beneficiariesWithIds = {
      beneficiaries: data.beneficiaries.map((ben, index) => ({
        ...ben,
        id: ben.id || `ben-${Date.now()}-${index}`,
      }))
    };
    saveAndGoTo(beneficiariesWithIds, "/dashboard");
  }


  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg mt-8">
        <div className="text-center mb-8">
            <Gift className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Your Beneficiaries</h1>
            <p className="text-foreground/80">Step 4 of 7</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <Alert>
              <Users className="h-4 w-4" />
              <AlertTitle>Who are Beneficiaries?</AlertTitle>
              <AlertDescription>
                A beneficiary is any person or entity (like a charity) you choose to receive your assets. You can add family members or anyone else you wish to include.
              </AlertDescription>
            </Alert>
          
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-6 border rounded-lg relative">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beneficiary Full Name</FormLabel>
                           <FormDescription>
                              The full legal name of the person or entity.
                            </FormDescription>
                          <FormControl>
                            <Input placeholder="e.g., Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.relationship`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship to You</FormLabel>
                          <FormDescription>
                              Your relationship to this person (e.g., Spouse, Son).
                            </FormDescription>
                          <FormControl>
                            <Input placeholder="e.g., Spouse, Son, Friend" {...field} />
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
                      <span className="sr-only">Remove beneficiary</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
                <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", relationship: "" })}
                >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Beneficiary
                </Button>
            </div>

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
