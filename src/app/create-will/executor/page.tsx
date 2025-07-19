
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronLeft, UserCheck, Edit, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect } from "react";

const executorSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  fatherName: z.string().min(2, "Father's name is required."),
  aadhar: z.string().regex(/^\d{12}$/, "Enter a valid 12-digit Aadhar."),
  address: z.string().min(10, "Address is required."),
  email: z.string().email("Enter a valid email."),
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number."),
});

const formSchema = z.object({
  primaryExecutor: executorSchema,
  addSecondExecutor: z.boolean().default(false).optional(),
  secondExecutor: executorSchema.optional(),
  specialInstructions: z.string().optional(),
}).refine(data => {
    if (data.addSecondExecutor && !data.secondExecutor) {
        return false;
    }
    return true;
}, {
    message: "Second executor details are required when the box is checked.",
    path: ["secondExecutor"],
});

type ExecutorFormValues = z.infer<typeof formSchema>;

export default function ExecutorPage() {
  const { formData, saveAndGoTo, setDirty } = useWillForm();

  const form = useForm<ExecutorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData.executor || {
      primaryExecutor: {
        fullName: "",
        fatherName: "",
        aadhar: "",
        address: "",
        email: "",
        mobile: "",
      },
      addSecondExecutor: false,
    },
  });

  const watchAddSecondExecutor = form.watch("addSecondExecutor");

  useEffect(() => {
    const subscription = form.watch(() => setDirty(true));
    return () => subscription.unsubscribe();
  }, [form, setDirty]);

  function onSubmit(data: ExecutorFormValues) {
    saveAndGoTo(data, "/create-will/review"); 
  }

  function handleBack() {
    saveAndGoTo(form.getValues(), "/create-will/asset-allocation");
  }

  function handleSaveAndExit(data: ExecutorFormValues) {
    saveAndGoTo(data, "/dashboard");
  }


  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-8 rounded-lg shadow-lg mt-8">
        <div className="text-center mb-8">
            <UserCheck className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Executor & Instructions</h1>
            <p className="text-foreground/80">Step 6 of 7</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-4 font-headline">Primary Executor</h2>
              <div className="space-y-6 p-6 border rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="primaryExecutor.fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="primaryExecutor.fatherName" render={({ field }) => ( <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="primaryExecutor.aadhar" render={({ field }) => ( <FormItem><FormLabel>Aadhar Number</FormLabel><FormControl><Input maxLength={12} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="primaryExecutor.address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="primaryExecutor.email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="primaryExecutor.mobile" render={({ field }) => ( <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" maxLength={10} {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>
            </div>

            <Separator />
            
            <FormField
              control={form.control}
              name="addSecondExecutor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Add a Second Executor
                    </FormLabel>
                    <FormDescription>
                      Appoint a second executor in case the primary one is unable or unwilling to act.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchAddSecondExecutor && (
                <div>
                    <h2 className="text-2xl font-semibold text-primary mb-4 font-headline">Second Executor</h2>
                    <div className="space-y-6 p-6 border rounded-lg">
                        <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="secondExecutor.fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="secondExecutor.fatherName" render={({ field }) => ( <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField control={form.control} name="secondExecutor.aadhar" render={({ field }) => ( <FormItem><FormLabel>Aadhar Number</FormLabel><FormControl><Input maxLength={12} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="secondExecutor.address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="secondExecutor.email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="secondExecutor.mobile" render={({ field }) => ( <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" maxLength={10} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                </div>
            )}
            
            <Separator />
            
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-4 font-headline flex items-center"><Edit className="mr-2 h-6 w-6"/> Special Requests or Conditions</h2>
              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please include any specific instructions, conditions, or wishes for your executor..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between mt-8">
              <Button type="button" size="lg" variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous Step
              </Button>
               <Button type="button" size="lg" variant="secondary" onClick={form.handleSubmit(handleSaveAndExit)}>
                  <Save className="mr-2 h-5 w-5" /> Save & Exit
              </Button>
              <Button type="submit" size="lg">
                Proceed to Review <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
