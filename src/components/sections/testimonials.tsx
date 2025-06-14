
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import Image from "next/image";

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

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-primary/5">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">Peace of Mind for Families Across India</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Hear from Indians who've secured their family's future with iWills.in.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col justify-between bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <CardContent className="p-6 md:p-8 text-center">
                <Quote className="w-10 h-10 text-primary/50 mx-auto mb-6" aria-hidden="true" />
                <p className="text-foreground/80 italic text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center justify-center">
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
