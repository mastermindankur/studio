
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { Gavel } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent text-primary-foreground py-12 mt-auto">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4" aria-label="iWills LegalEase Home">
              <Gavel className="h-8 w-8 text-primary-foreground" />
              <span className="font-headline text-2xl font-bold text-primary-foreground">iWills LegalEase</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Providing expert legal advice and services with integrity and professionalism.
            </p>
          </div>

          <div className="md:col-span-2">
             <NewsletterSignup />
          </div>
        </div>
        
        <div className="mt-10 border-t border-primary-foreground/20 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} iWills LegalEase. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/privacy-policy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link> | 
            <Link href="/terms-of-service" className="hover:text-primary-foreground transition-colors ml-1"> Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
