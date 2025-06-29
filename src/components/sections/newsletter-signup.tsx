
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
import { useToast } from "@/hooks/use-toast";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { Send } from "lucide-react";

const newsletterFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

export function NewsletterSignup() {
  const { toast } = useToast();
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: NewsletterFormValues) {
    try {
      const result = await subscribeToNewsletter(data);
      if (result.success) {
        toast({
          title: "Subscribed!",
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Subscription Failed",
          description: result.message || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not subscribe. Please try again later.",
      });
    }
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="font-headline text-xl font-semibold text-foreground mb-4">Stay Informed on Indian Will & Succession Laws</h3>
      <p className="text-foreground/80 mb-6">
        Sign up for our newsletter for updates on Indian succession laws, Will creation tips, and news from iWills.in.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 items-start">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-grow w-full">
                <FormLabel className="sr-only">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter your email address" 
                    {...field} 
                    className="bg-background/80 text-foreground placeholder:text-muted-foreground border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            variant="default"
            className="w-full sm:w-auto"
            disabled={form.formState.isSubmitting}
            aria-label="Subscribe to newsletter"
          >
            <Send className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
