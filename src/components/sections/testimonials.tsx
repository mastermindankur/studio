
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, UIEvent } from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatarSrc?: string;
  avatarFallback: string;
  imageHint: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "iWills.in made creating my Will so straightforward. The platform is easy to use, and I feel secure knowing my wishes for my property in India are clearly documented.",
    author: "Priya S.",
    role: "IT Professional, Bangalore",
    avatarSrc: "https://placehold.co/100x100.png",
    avatarFallback: "PS",
    imageHint: "woman portrait",
  },
  {
    quote: "The team at iWills.in is not only knowledgeable about Indian succession laws but also incredibly supportive. They made a difficult process much more manageable.",
    author: "Rohan M.",
    role: "Retired Teacher, Delhi",
    avatarSrc: "https://placehold.co/100x100.png",
    avatarFallback: "RM",
    imageHint: "man portrait",
  },
  {
    quote: "I highly recommend iWills.in for their meticulous attention to detail and client-focused approach for Will creation in India. Truly a five-star experience.",
    author: "Ananya K.",
    role: "Homemaker, Mumbai",
    avatarSrc: "https://placehold.co/100x100.png",
    avatarFallback: "AK",
    imageHint: "person smiling",
  },
];

const TestimonialCard = ({ testimonial, isVisible }: { testimonial: Testimonial, isVisible: boolean }) => (
  <Card 
    className={cn(
        "flex flex-col justify-between bg-card shadow-lg rounded-lg overflow-hidden w-[90vw] sm:w-80 md:w-full flex-shrink-0 snap-center md:snap-align-none transition-all duration-500 ease-out",
        isVisible ? "transform scale-100 opacity-100" : "transform scale-95 opacity-60"
    )}
  >
    <CardContent className="p-6 md:p-8 text-center flex-grow flex flex-col">
      <Quote className="w-10 h-10 text-primary/50 mx-auto mb-6" aria-hidden="true" />
      <p className="text-foreground/80 italic text-lg mb-6 leading-relaxed flex-grow">"{testimonial.quote}"</p>
      <div className="flex items-center justify-center mt-auto">
        <Avatar className="h-12 w-12 mr-4">
          {testimonial.avatarSrc && (
              <AvatarImage asChild src={testimonial.avatarSrc} alt={testimonial.author}>
                <Image src={testimonial.avatarSrc} alt={testimonial.author} width={100} height={100} data-ai-hint={testimonial.imageHint} />
              </AvatarImage>
          )}
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{testimonial.avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-headline font-semibold text-primary text-lg">{testimonial.author}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);


  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
    }
    // Store the target in a variable to avoid accessing the event object in the timeout
    const currentTarget = event.currentTarget;
    scrollTimeout.current = setTimeout(() => {
        const scrollLeft = currentTarget.scrollLeft;
        const cardWidth = currentTarget.offsetWidth;
        const newIndex = Math.round(scrollLeft / cardWidth);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    }, 150);
  };
  
  useEffect(() => {
    return () => {
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
    }
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-primary/5">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">Peace of Mind for Families Across India</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Hear from Indians who've secured their family's future with iWills.in.
          </p>
        </div>
        
        {/* Mobile: Swipeable container */}
        <div className="md:hidden">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 -mx-4 px-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} isVisible={index === activeIndex} />
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <div 
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors duration-300",
                    index === activeIndex ? "bg-primary" : "bg-primary/40"
                  )}
                />
              ))}
          </div>
        </div>

        {/* Desktop: Static grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col justify-between bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden w-full flex-shrink-0 snap-center md:snap-align-none">
              <CardContent className="p-6 md:p-8 text-center flex-grow flex flex-col">
                <Quote className="w-10 h-10 text-primary/50 mx-auto mb-6" aria-hidden="true" />
                <p className="text-foreground/80 italic text-lg mb-6 leading-relaxed flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center justify-center mt-auto">
                  <Avatar className="h-12 w-12 mr-4">
                    {testimonial.avatarSrc && (
                        <AvatarImage asChild src={testimonial.avatarSrc} alt={testimonial.author}>
                          <Image src={testimonial.avatarSrc} alt={testimonial.author} width={100} height={100} data-ai-hint={testimonial.imageHint} />
                        </AvatarImage>
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{testimonial.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-headline font-semibold text-primary text-lg">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
