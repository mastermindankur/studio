
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, ChevronLeft, PlusCircle, Trash2, Users, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect } from "react";

const familyDetailsSchema = z.object({
  maritalStatus: z.enum(["married", "unmarried", "divorced", "widowed"], {
    required_error: "Please select your marital status.",
  }),
  spouseName: z.string().optional(),
  children: z.array(z.object({
    name: z.string().min(2, "Child's name must be at least 2 characters."),
  })).optional(),
}).refine(data => {
    if (data.maritalStatus === 'married' && (!data.spouseName || data.spouseName.length < 2)) {
        return false;
    }
    return true;
}, {
    message: "Spouse's name is required and must be at least 2 characters.",
    path: ["spouseName"],
});

type FamilyDetailsFormValues = z.infer<typeof familyDetailsSchema>;

export default function FamilyDetailsPage() {
  const { formData, saveAndGoTo, setDirty } = useWillForm();

  const form = useForm<FamilyDetailsFormValues>({
    resolver: zodResolver(familyDetailsSchema),
    defaultValues: formData.familyDetails,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  });
  
  const watchMaritalStatus = form.watch("maritalStatus");

  useEffect(() => {
    const subscription = form.watch(() => setDirty(true));
    return () => subscription.unsubscribe();
  }, [form, setDirty]);

  useEffect(() => {
    if (watchMaritalStatus !== 'married') {
        form.setValue('spouseName', '');
    }
  }, [watchMaritalStatus, form]);

  function onSubmit(data: FamilyDetailsFormValues) {
    saveAndGoTo(data, "/create-will/assets");
  }
  
  function handleBack() {
    saveAndGoTo(form.getValues(), "/create-will/personal-information");
  }

  function handleSaveAndExit(data: FamilyDetailsFormValues) {
    saveAndGoTo(data, "/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-8 rounded-lg shadow-lg mt-8">
        <div className="text-center mb-8">
            <Users className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Family Details</h1>
            <p className="text-foreground/80">Step 2 of 7</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Marital Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {["Married", "Unmarried", "Divorced", "Widowed"].map((status) => (
                        <FormItem key={status} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value={status.toLowerCase()} />
                            </FormControl>
                            <FormLabel className="font-normal">{status}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchMaritalStatus === "married" && (
                <FormField
                    control={form.control}
                    name="spouseName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Spouse's Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your spouse's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            
            <div>
                <FormLabel>Children's Details</FormLabel>
                <div className="space-y-4 mt-2">
                    {fields.map((field, index) => (
                         <FormField
                            key={field.id}
                            control={form.control}
                            name={`children.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                <div className="flex items-center gap-4">
                                    <FormControl>
                                        <Input placeholder={`Child ${index + 1}'s full name`} {...field} />
                                    </FormControl>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove child</span>
                                    </Button>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => append({ name: "" })}
                    >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Child
                </Button>
            </div>

            <div className="flex justify-between">
              <Button type="button" size="lg" variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous Step
              </Button>
               <Button type="button" size="lg" variant="secondary" onClick={form.handleSubmit(handleSaveAndExit)}>
                  <Save className="mr-2 h-5 w-5" /> Save & Exit
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
