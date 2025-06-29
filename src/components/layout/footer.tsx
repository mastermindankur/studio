import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { Gavel } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent text-accent-foreground py-12 mt-auto">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4" aria-label="iWills.in Home">
              <Gavel className="h-8 w-8 text-primary-foreground" />
              <span className="font-headline text-2xl font-bold text-primary-foreground">iWills.in</span>
            </Link>
            <p className="text-sm text-primary-foreground/80">
              Specializing in online Will creation for India, ensuring your legacy is protected.
            </p>
          </div>

          <div className="md:col-span-2">
             <NewsletterSignup />
          </div>
        </div>
        
        <div className="mt-10 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/80">
          <p>&copy; {currentYear} iWills.in. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/privacy-policy" className="hover:text-primary-foreground hover:underline transition-colors">Privacy Policy</Link> | 
            <Link href="/terms-of-service" className="hover:text-primary-foreground hover:underline transition-colors ml-1"> Terms of Service</Link> |
            <Link href="/faqs" className="hover:text-primary-foreground hover:underline transition-colors ml-1"> FAQs</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
