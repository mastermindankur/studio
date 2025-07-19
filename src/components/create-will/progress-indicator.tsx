
"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWillForm } from "@/context/WillFormContext";
import {
  User,
  Users,
  Landmark,
  Gift,
  PieChart,
  UserCheck,
  FileCheck,
} from "lucide-react";

const steps = [
  { name: "Personal Info", path: "/create-will/personal-information", icon: User },
  { name: "Family", path: "/create-will/family-details", icon: Users },
  { name: "Assets", path: "/create-will/assets", icon: Landmark },
  { name: "Beneficiaries", path: "/create-will/beneficiaries", icon: Gift },
  { name: "Allocation", path: "/create-will/asset-allocation", icon: PieChart },
  { name: "Executor", path: "/create-will/executor", icon: UserCheck },
  { name: "Review", path: "/create-will/review", icon: FileCheck },
];

export function ProgressIndicator() {
  const pathname = usePathname();
  const router = useRouter();
  const { formData, saveAndGoTo } = useWillForm();

  const currentStepIndex = steps.findIndex((step) => pathname === step.path);

  const handleStepClick = (path: string, index: number) => {
    // For now, allow navigation to any step.
    // In a real app, you might want to prevent jumping ahead to unvisited steps.
    const stepKeyMap: { [key: string]: keyof typeof formData } = {
        "/create-will/personal-information": "personalInfo",
        "/create-will/family-details": "familyDetails",
        "/create-will/assets": "assets",
        "/create-will/beneficiaries": "beneficiaries",
        "/create-will/asset-allocation": "assetAllocation",
        "/create-will/executor": "executor",
        "/create-will/review": "review"
    };

    const currentStepKey = stepKeyMap[pathname];
    if (currentStepKey && formData[currentStepKey]) {
        saveAndGoTo(formData[currentStepKey], path);
    } else {
        router.push(path);
    }
  };

  return (
    <div className="w-full">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={cn("relative", stepIdx !== steps.length - 1 ? "flex-1" : "")}
            >
              <>
                {stepIdx < currentStepIndex ? (
                  // Completed step
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-primary" />
                    </div>
                    <button
                      onClick={() => handleStepClick(step.path, stepIdx)}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/80"
                    >
                      <step.icon className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                      <span className="sr-only">{step.name}</span>
                    </button>
                  </>
                ) : stepIdx === currentStepIndex ? (
                  // Current step
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-border" />
                    </div>
                    <button
                      onClick={() => handleStepClick(step.path, stepIdx)}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background"
                      aria-current="step"
                    >
                      <step.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      <span className="sr-only">{step.name}</span>
                    </button>
                  </>
                ) : (
                  // Upcoming step
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-border" />
                    </div>
                     <button
                      onClick={() => handleStepClick(step.path, stepIdx)}
                      className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background hover:border-muted-foreground"
                    >
                      <step.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
                      <span className="sr-only">{step.name}</span>
                    </button>
                  </>
                )}
                 <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs text-center w-20">
                  {step.name}
                </span>
              </>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
