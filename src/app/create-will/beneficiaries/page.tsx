
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChevronRight, PlusCircle, Trash2, Edit, Gift, Users, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddBeneficiaryModal } from "@/components/create-will/add-beneficiary-modal";
import { beneficiaryFormSchema as beneficiarySchema, type Beneficiary } from "@/lib/schemas/beneficiary-schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const beneficiariesFormSchema = z.object({
  beneficiaries: z.array(beneficiarySchema),
});

type BeneficiariesFormValues = z.infer<typeof beneficiariesFormSchema>;

export default function BeneficiariesPage() {
  const { formData, loading, addBeneficiary, updateBeneficiary, removeBeneficiary } = useWillForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const router = useRouter();

  const form = useForm<BeneficiariesFormValues>({
    defaultValues: { beneficiaries: [] },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "beneficiaries",
    keyName: "formId"
  });

  useEffect(() => {
    if (!loading && formData.beneficiaries?.beneficiaries) {
      form.reset({ beneficiaries: formData.beneficiaries.beneficiaries });
    }
  }, [loading, formData.beneficiaries, form]);

  const { version, createdAt, familyDetails } = formData;
  const isEditing = !!version;

  function onSubmit(data: BeneficiariesFormValues) {
    // This is now purely for navigation
    router.push("/create-will/asset-allocation");
  }

  const handleAddNewBeneficiary = () => {
    setEditingBeneficiary(null);
    setIsModalOpen(true);
  };

  const handleEditBeneficiary = (index: number) => {
    const beneficiaryToEdit = form.getValues().beneficiaries[index];
    setEditingBeneficiary({ ...beneficiaryToEdit, index });
    setIsModalOpen(true);
  };

  const handleSaveBeneficiary = async (beneficiary: Beneficiary) => {
    if (beneficiary.index !== undefined && beneficiary.id) {
      // This is an update
      await updateBeneficiary(beneficiary); // This now saves to DB
      const { index, ...beneficiaryData } = beneficiary;
      update(index, beneficiaryData);
    } else {
      // This is a new beneficiary
      const newId = await addBeneficiary(beneficiary); // This now saves to DB and returns an ID
      if (newId) {
        append({ ...beneficiary, id: newId });
      }
    }
    setIsModalOpen(false);
    setEditingBeneficiary(null);
  };

  const handleRemoveBeneficiary = async (index: number) => {
    const beneficiaryId = form.getValues().beneficiaries[index].id;
    if (beneficiaryId) {
      await removeBeneficiary(beneficiaryId); // This now deletes from DB
      remove(index);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
         <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
           <Skeleton className="h-12 w-12 mx-auto mb-2" />
           <Skeleton className="h-9 w-1/2 mx-auto mb-8" />
           <Skeleton className="h-40 w-full mb-8" />
           <Skeleton className="h-20 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
                ))}
                <Skeleton className="h-48 w-full border-dashed border-2" />
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
       <AddBeneficiaryModal
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setEditingBeneficiary(null);
        }}
        onSave={handleSaveBeneficiary}
        beneficiaryData={editingBeneficiary}
      />
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

        <Card className="mb-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2"><Users /> Primary Family Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These family members are from the 'Family Details' step. They are automatically available for asset allocation. It is not mandatory to allocate assets to every family member.
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
                 <p className="text-sm text-center text-muted-foreground py-4">No primary family members listed. Add them in 'Family Details'.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Add Other Beneficiaries</AlertTitle>
          <AlertDescription>
            You can add anyone else you wish to include (like friends, other relatives, or charities) below. Your changes are saved automatically.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map((beneficiary, index) => (
                    <Card key={beneficiary.formId} className="overflow-hidden flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
                            <CardTitle className="text-base font-semibold text-primary truncate flex items-center gap-2">
                                <Gift className="h-5 w-5 flex-shrink-0" />
                                {beneficiary.name}
                            </CardTitle>
                            <div className="flex gap-1">
                                <Button type="button" variant="ghost" size="icon" className="text-primary hover:bg-primary/10 h-8 w-8" onClick={() => handleEditBeneficiary(index)}><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                                <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8" onClick={() => handleRemoveBeneficiary(index)}><Trash2 className="h-4 w-4" /><span className="sr-only">Remove</span></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                             <div>
                                <p className="text-sm text-muted-foreground">Relationship</p>
                                <p className="font-semibold">{beneficiary.relationship}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                 <Card className="border-dashed border-2 hover:border-primary hover:text-primary transition-colors duration-200 flex items-center justify-center min-h-[170px]">
                    <Button
                    type="button"
                    variant="ghost"
                    className="w-full h-full text-lg"
                    onClick={handleAddNewBeneficiary}
                    >
                    <PlusCircle className="mr-2 h-6 w-6" />
                    Add Beneficiary
                    </Button>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 border-t pt-6 mt-6">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Continue to Asset Allocation <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
