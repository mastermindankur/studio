
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
import { ChevronRight, PlusCircle, Trash2, Gift, Users, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const { formData, saveAndGoTo, setDirty, loading } = useWillForm();

  const form = useForm<BeneficiariesFormValues>({
    resolver: zodResolver(beneficiariesFormSchema),
    defaultValues: formData.beneficiaries,
  });

  useEffect(() => {
    if (!loading && formData.beneficiaries) {
        form.reset(formData.beneficiaries);
    }
  }, [loading, formData.beneficiaries, form]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "beneficiaries",
  });
  
  const { version, createdAt, familyDetails } = formData;
  const isEditing = !!version;

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
            <Gift className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Your Beneficiaries</h1>
            {isEditing && (
              <p className="text-foreground/80 mt-2">
                Editing Will Version {version} (created on {createdAt ? format(new Date(createdAt), "PPP") : 'N/A'})
              </p>
            )}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2"><Users /> Primary Family Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These family members are automatically included from the 'Family Details' step. You can allocate assets to them in the next step.
            </p>
            <div className="space-y-3">
              {familyDetails?.spouseName && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="font-medium">{familyDetails.spouseName}</span>
                  <Badge variant="secondary">Spouse</Badge>
                </div>
              )}
              {familyDetails?.children?.map((child, index) => (
                child.name && (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="font-medium">{child.name}</span>
                    <Badge variant="secondary">Child</Badge>
                  </div>
                )
              ))}
              {(!familyDetails?.spouseName || familyDetails.spouseName.trim() === '') && (!familyDetails?.children || familyDetails.children.every(c => !c.name || c.name.trim() === '')) && (
                 <p className="text-sm text-center text-muted-foreground py-4">No primary family members were listed in the previous step.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Add Other Beneficiaries (Optional)</AlertTitle>
          <AlertDescription>
            You can add anyone else you wish to include (like friends, other relatives, or charities) below. It is not mandatory to give an asset to every beneficiary you list.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
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
                              Your relationship (e.g., Friend, Nephew, Charity).
                            </FormDescription>
                          <FormControl>
                            <Input placeholder="e.g., Friend, Charity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 0 && (
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
