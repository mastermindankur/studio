
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, IndianRupee } from "lucide-react";
import Link from "next/link";

interface PricingPlan {
  title: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonLink: string; 
}

const plans: PricingPlan[] = [
  {
    title: "Basic Will Creation",
    description: "Essential package including standard will creation.",
    price: "999",
    features: [
      "Standard Will Creation",
      "Do It Yourself",
      "Print and Sign",
    ],
    buttonText: "Get Started",
    buttonLink: "/create-will/personal-information"
  },
  {
    title: "Standard Will with Notarization",
    description: "Includes notarization for added legal validity.",
    price: "2499",
    features: [
      "Standard Will Creation",
      "Notarization",
      "Consultation with Legal Experts",
    ],
    isPopular: true,
    buttonText: "Choose Plan",
    buttonLink: "/create-will/personal-information"
  },
  {
    title: "Comprehensive Will with Registration",
    description: "Complete package with will registration for maximum protection.",
    price: "4999",
    features: [
      "Standard Will Creation",
      "Registration of Will",
      "Consultation with Legal Experts",
    ],
    buttonText: "Choose Plan",
    buttonLink: "/create-will/personal-information"
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            Transparent Pricing for Your Peace of Mind
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Choose the plan that best suits your needs for creating your Will in India. No hidden fees.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card 
                          ${plan.isPopular ? "border-2 border-primary ring-2 ring-primary/50 relative" : "border-border"}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-full shadow-md z-10">
                  POPULAR
                </div>
              )}
              <CardHeader className="p-6 pt-8">
                <CardTitle className="font-headline text-2xl text-primary mb-2 text-center">{plan.title}</CardTitle>
                <CardDescription className="text-foreground/70 text-sm text-center min-h-[40px]">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                <div className="mb-6 text-center">
                  <span className="font-headline text-4xl font-bold text-primary flex items-center justify-center">
                    <IndianRupee className="h-7 w-7 mr-1" />
                    {plan.price}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6 mt-auto">
                <Button 
                  size="lg" 
                  className="w-full font-headline text-lg"
                  variant={plan.isPopular ? "default" : "secondary"}
                  asChild
                >
                  <Link href={plan.buttonLink}>{plan.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         <p className="text-center mt-12 text-sm text-muted-foreground">
          All prices are inclusive of applicable taxes. For custom requirements, please <a href="#contact" className="text-primary hover:underline">contact us</a>.
        </p>
      </div>
    </section>
  );
}
