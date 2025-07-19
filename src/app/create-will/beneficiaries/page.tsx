
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
import { ChevronRight, ChevronLeft, PlusCircle, Trash2, Gift, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const beneficiarySchema = z.object({
  name: z.string().min(2, "Beneficiary's name must be at least 2 characters."),
  relationship: z.string().min(2, "Relationship must be at least 2 characters."),
});

const beneficiariesFormSchema = z.object({
  beneficiaries: z.array(beneficiarySchema),
});

type BeneficiariesFormValues = z.infer<typeof beneficiariesFormSchema>;

export default function BeneficiariesPage() {
  const router = useRouter();
  const form = useForm<BeneficiariesFormValues>({
    resolver: zodResolver(beneficiariesFormSchema),
    defaultValues: {
      beneficiaries: [{ name: "", relationship: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "beneficiaries",
  });

  function onSubmit(data: BeneficiariesFormValues) {
    console.log(data);
    // TODO: Save data to global state
    router.push("/create-will/executor"); // Navigate to next step
  }

  function handleBack() {
    router.push("/create-will/assets");
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Gift className="w-12 h-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-primary font-headline">Create Your Will</h1>
        <p className="text-foreground/80">Step 4 of 6: Your Beneficiaries</p>
      </div>
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <Alert>
              <Users className="h-4 w-4" />
              <AlertTitle>Add Your Beneficiaries</AlertTitle>
              <AlertDescription>
                You can add your spouse and children (from Step 2) as beneficiaries here, or add anyone else you wish to include in your will.
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
