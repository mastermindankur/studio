
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, SplitSquareHorizontal, DownloadCloud, FileSignature, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  stepNumber: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: ClipboardList,
    stepNumber: "Step 1",
    title: "Provide Basic Details",
    description: "Share your personal and family information. Share the assets you own.",
  },
  {
    icon: SplitSquareHorizontal,
    stepNumber: "Step 2",
    title: "Specify Your Distribution Preferences",
    description: "Add your beneficiaries and Decide how to distribute your assets by percentage.",
  },
  {
    icon: DownloadCloud,
    stepNumber: "Step 3",
    title: "Review and Download Your Draft",
    description: "Preview and finalize your Will. You'll receive it via email in PDF format.",
  },
  {
    icon: FileSignature,
    stepNumber: "Step 4",
    title: "Print and Sign Your Will",
    description: "Print and sign your Will with two witnesses. Your Will is now legally valid! You may also get it notarised or registered.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-primary/5">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Workflow className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">4 Simple Steps to Create Your Will</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="flex flex-col bg-card hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center mr-4">
                    <step.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-primary">{step.stepNumber}</p>
                    <CardTitle className="font-headline text-lg md:text-xl text-primary">{step.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-grow">
                <p className="text-foreground/70 text-sm md:text-base leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
