
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/app/actions/contact";
import { Mail, User, MessageSquare, Phone, Loader2, SendHorizontal, Building } from "lucide-react";
import Image from "next/image";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      const result = await submitContactForm(data);
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send message. Please try again later.",
      });
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-primary/5">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">Questions About Your Will?</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            If you have questions about creating your Will in India or need support with our platform, please use the form below.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-card p-8 md:p-10 rounded-lg shadow-xl animate-slide-in-left">
            <h3 className="font-headline text-2xl font-semibold text-primary mb-6">Send Us a Message</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Your Name" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">Email Address</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input type="email" placeholder="you@example.com" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Phone Number</FormLabel>
                      <FormControl>
                         <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Subject</FormLabel>
                      <FormControl>
                         <div className="relative">
                          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Question about Will creation" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe your questions or support needs..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full font-headline text-lg shadow-md hover:shadow-lg transition-shadow" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <SendHorizontal className="mr-2 h-5 w-5" />}
                  {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="animate-slide-in-right mt-8 md:mt-0">
             <div className="rounded-lg overflow-hidden shadow-xl aspect-square max-w-md mx-auto md:max-w-full">
                <Image
                    src="/images/contact-image.png"
                    alt="iWills.in Support"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                    data-ai-hint="customer service india"
                />
             </div>
             <div className="mt-8 text-center md:text-left">
                <h3 className="font-headline text-2xl font-semibold text-primary mb-3 flex items-center justify-center md:justify-start"><Building className="mr-2 h-6 w-6"/>Our Office (India)</h3>
                <p className="text-foreground/80 mb-1">Plot No. 42, Tech Park</p>
                <p className="text-foreground/80 mb-1">Cyberabad, Hyderabad, Telangana 500081</p>
                <p className="text-foreground/80 mb-3">India</p>
                <p className="text-foreground/80 mb-1"><strong>Phone:</strong> +91-8919321064</p>
                <p className="text-foreground/80"><strong>Email:</strong> hello@iwills.in</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
