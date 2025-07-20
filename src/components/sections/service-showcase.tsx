
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Laptop, ShieldCheck, Bot, IndianRupee, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useRef, UIEvent } from "react";
import { cn } from "@/lib/utils";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  imageHint: string;
}

const services: Service[] = [
  {
    icon: FileText,
    title: "Legally Sound Wills",
    description: "Create legally binding Wills fully compliant with Indian succession laws and regulations.",
    imageHint: "legal document india",
  },
  {
    icon: Laptop,
    title: "Easy Online Process",
    description: "Our user-friendly platform guides you step-by-step to create your Will online, anytime, anywhere in India.",
    imageHint: "laptop computer",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Confidential",
    description: "Your personal information and Will details are kept secure and confidential with robust security measures.",
    imageHint: "digital security lock",
  },
  {
    icon: Bot,
    title: "AI-Powered Guidance",
    description: "Get instant answers to your Will-related questions from our intelligent AI assistant, trained on Indian law.",
    imageHint: "robot chat bubble",
  },
  {
    icon: IndianRupee,
    title: "Affordable & Transparent",
    description: "Clear, upfront pricing for creating your Will in India, with no hidden fees or surprises.",
    imageHint: "money savings rupee",
  },
  {
    icon: Clock,
    title: "Quick & Convenient",
    description: "Generate your comprehensive Will in minutes, saving you valuable time and effort.",
    imageHint: "time saving clock",
  },
];

export function ServiceShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const scrollLeft = event.currentTarget.scrollLeft;
    const cardWidth = scrollRef.current.children[0]?.clientWidth || 0;
    if (cardWidth === 0) return;

    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-primary/5">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">Online Will Creation in India: Simple & Secure</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            iWills.in offers a streamlined and reliable way to create your Will, ensuring your assets are distributed as per your wishes under Indian law.
          </p>
        </div>
        
        {/* Mobile: Swipeable container */}
        <div className="md:hidden">
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 -mx-4 px-4 scrollbar-hide"
            >
                {services.map((service, index) => (
                    <div key={index} className="w-[85vw] sm:w-80 flex-shrink-0 snap-center">
                        <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <CardHeader className="p-6">
                                <div className="mb-4 flex justify-center">
                                <service.icon className="w-12 h-12 text-primary" aria-hidden="true" />
                                </div>
                                <CardTitle className="font-headline text-2xl text-center text-primary">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 flex-grow">
                                <CardDescription className="text-center text-foreground/70 text-base leading-relaxed">
                                {service.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
                {services.map((_, index) => (
                    <div 
                        key={index}
                        className={cn(
                            "h-2 w-2 rounded-full transition-all duration-300",
                            index === activeIndex ? "bg-primary w-4" : "bg-primary/40"
                        )}
                    />
                ))}
            </div>
        </div>

        {/* Desktop: Static grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="p-6">
                <div className="mb-4 flex justify-center">
                  <service.icon className="w-12 h-12 text-primary" aria-hidden="true" />
                </div>
                <CardTitle className="font-headline text-2xl text-center text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardDescription className="text-center text-foreground/70 text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
