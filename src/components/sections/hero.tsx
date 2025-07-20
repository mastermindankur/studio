
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useAIChatStore } from "@/hooks/use-ai-chat-store";

export function HeroSection() {
  const { user } = useAuth();
  const { openChat } = useAIChatStore();
  const createWillHref = user ? "/create-will/personal-information" : "/signup";

  return (
    <section id="hero" className="py-20 md:py-32 bg-gradient-to-br from-background to-primary/10">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Secure Your Legacy: <br /> Online Will Creation for India.
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 mb-8 max-w-xl">
            Easily create legally sound Wills online, specifically designed for Indian laws and regulations. Protect your loved ones and ensure your wishes are followed with iWills.in.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="font-headline text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={createWillHref}>Create Your Will Now</Link>
            </Button>
            <Button onClick={openChat} variant="outline" size="lg" className="font-headline text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-primary text-primary hover:bg-primary/10">
              Ask Our AI Assistant
            </Button>
          </div>
        </div>
        <div className="relative flex justify-center md:justify-end">
          <div className="rounded-lg overflow-hidden shadow-2xl w-full max-w-md lg:max-w-lg aspect-[4/3]">
            <Image
              src="/images/hero-image.jpg"
              alt="Family discussing future planning in India"
              width={600}
              height={450}
              className="object-cover w-full h-full"
              data-ai-hint="indian family planning"
              priority
              unoptimized
            />
          </div>
           <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/20 rounded-full -z-10 hidden md:block"></div>
           <div className="absolute -top-8 -right-8 w-24 h-24 border-4 border-primary rounded-lg -z-10 hidden md:block transform rotate-12"></div>
        </div>
      </div>
    </section>
  );
}
