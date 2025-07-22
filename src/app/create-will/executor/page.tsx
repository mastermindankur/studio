
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
import { ChevronRight, UserCheck, Edit, Info, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription as AlertDesc } from "@/components/ui/alert";
import { format } from "date-fns";


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
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
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
  const { formData, saveAndGoTo, setDirty, loading } = useWillForm();

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
      city: "",
      state: "",
    },
  });

  useEffect(() => {
    if (!loading && formData.executor) {
        form.reset(formData.executor);
    }
  }, [loading, formData.executor, form]);


  const watchAddSecondExecutor = form.watch("addSecondExecutor");
  const { version, createdAt } = formData;
  const isEditing = !!version;

  useEffect(() => {
    const subscription = form.watch(() => setDirty(true));
    return () => subscription.unsubscribe();
  }, [form, setDirty]);

  function onSubmit(data: ExecutorFormValues) {
    saveAndGoTo('executor', data, "/create-will/review"); 
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
            <UserCheck className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Executor & Instructions</h1>
            {isEditing && (
              <p className="text-foreground/80 mt-2">
                Editing Will Version {version} (created on {createdAt ? format(new Date(createdAt), "PPP") : 'N/A'})
              </p>
            )}
        </div>
        <Form {...form}>
            <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>What is an Executor?</AlertTitle>
            <AlertDesc>
                The Executor is the person you trust to carry out the instructions in your will. They will be responsible for managing your estate, paying any debts, and distributing your assets to the beneficiaries. Choose someone reliable and trustworthy.
            </AlertDesc>
            </Alert>
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
                      Appoint a Second Executor
                    </FormLabel>
                    <FormDescription>
                      It's highly recommended to appoint an alternate executor in case the primary one is unable or unwilling to act.
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
              <h2 className="text-2xl font-semibold text-primary mb-4 font-headline flex items-center"><Edit className="mr-2 h-6 w-6"/> Special Instructions</h2>
              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions for your Executor</FormLabel>
                    <FormDescription>
                      You can include specific wishes here, such as instructions for your funeral, care for pets, or explanations for certain decisions in your will. This is optional.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I wish to be cremated... I want my collection of books to be donated..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />

             <div>
              <h2 className="text-2xl font-semibold text-primary mb-4 font-headline flex items-center"><MapPin className="mr-2 h-6 w-6"/> Place of Signing</h2>
                <FormDescription>This is the location where you will sign your will.</FormDescription>
                <div className="grid md:grid-cols-2 gap-6 mt-4 p-6 border rounded-lg">
                    <FormField control={form.control} name="city" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Hyderabad" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="state" render={({ field }) => ( <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="e.g., Telangana" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
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
