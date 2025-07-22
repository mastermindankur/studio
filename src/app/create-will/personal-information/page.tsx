
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronRight, Gavel, Info } from "lucide-react";
import { format, subYears } from "date-fns";
import { useRouter } from "next/navigation";
import { useWillForm } from "@/context/WillFormContext";
import { useEffect, useState } from "react";

const personalInfoSchema = z.object({
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  dob: z.date({ required_error: "A date of birth is required." }),
  fatherHusbandName: z.string().min(2, "This field is required."),
  religion: z.string({ required_error: "Please select a religion." }),
  aadhar: z.string().regex(/^\d{12}$/, "Please enter a valid 12-digit Aadhar number."),
  occupation: z.string().min(2, "Occupation is required."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  email: z.string().email("Invalid email address."),
  mobile: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export default function PersonalInformationPage() {
  const router = useRouter();
  const { formData, saveAndGoTo, setDirty, loading } = useWillForm();

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData.personalInfo,
  });

  useEffect(() => {
    if (!loading && formData.personalInfo) {
        // Ensure DOB is a Date object
        const personalInfoWithDate = {
            ...formData.personalInfo,
            dob: formData.personalInfo.dob ? new Date(formData.personalInfo.dob) : undefined,
        };
        form.reset(personalInfoWithDate);
    }
  }, [loading, formData.personalInfo, form]);


  const { version, createdAt } = formData;
  const isEditing = !!version;

  useEffect(() => {
    const subscription = form.watch(() => setDirty(true));
    return () => subscription.unsubscribe();
  }, [form, setDirty]);

  function onSubmit(data: PersonalInfoFormValues) {
    saveAndGoTo(data, "/create-will/family-details");
  }

  const today = new Date();
  const eighteenYearsAgo = subYears(today, 18);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
            <Gavel className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Personal Information</h1>
            {isEditing && (
              <p className="text-foreground/80 mt-2">
                Editing Will Version {version} (created on {createdAt ? format(new Date(createdAt), "PPP") : 'N/A'})
              </p>
            )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                   <FormDescription>
                    Your gender as per official records.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                     <FormDescription>
                        Your full legal name as it should appear on the will.
                      </FormDescription>
                    <FormControl>
                        <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                     <FormDescription>
                        Used to confirm you are of legal age to make a will.
                      </FormDescription>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(new Date(field.value), "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            defaultMonth={field.value || subYears(new Date(), 30)}
                            disabled={(date) =>
                                date > eighteenYearsAgo || date < new Date("1920-01-01")
                            }
                            captionLayout="dropdown"
                            fromYear={1920}
                            toYear={eighteenYearsAgo.getFullYear()}
                            initialFocus
                            fixedWeeks
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="fatherHusbandName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Father/Husband Full Name</FormLabel>
                     <FormDescription>
                        Helps in clearly identifying you for the will's validity.
                      </FormDescription>
                    <FormControl>
                        <Input placeholder="Father's or Husband's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Religion</FormLabel>
                     <FormDescription>
                        Succession laws can differ based on religion in India.
                      </FormDescription>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your religion" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="hindu">Hindu</SelectItem>
                        <SelectItem value="muslim">Muslim</SelectItem>
                        <SelectItem value="christian">Christian</SelectItem>
                        <SelectItem value="sikh">Sikh</SelectItem>
                        <SelectItem value="jain">Jain</SelectItem>
                        <SelectItem value="buddhist">Buddhist</SelectItem>
                        <SelectItem value="parsi">Parsi</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="aadhar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Aadhar Number</FormLabel>
                  <FormControl>
                    <Input type="text" maxLength={12} placeholder="Enter 12-digit Aadhar number" {...field} />
                  </FormControl>
                  <FormDescription className="flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    This ensures your will cannot be challenged on grounds of identity. We never share it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                   <FormDescription>
                      Your current profession or status (e.g., Homemaker, Retired).
                    </FormDescription>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer, Doctor, Homemaker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                   <FormDescription>
                      Your full residential address is required for legal identification in the will document.
                    </FormDescription>
                  <FormControl>
                    <Textarea placeholder="Your full current address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                         <FormDescription>
                            We will send the final will document to this email.
                          </FormDescription>
                        <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                         <FormDescription>
                            Used for communication regarding your will creation process.
                          </FormDescription>
                        <FormControl>
                            <Input type="tel" maxLength={10} placeholder="Enter 10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-end mt-8 gap-4">
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
