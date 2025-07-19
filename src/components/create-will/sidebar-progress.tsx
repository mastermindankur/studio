
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
  { name: "Family Details", path: "/create-will/family-details", icon: Users },
  { name: "Assets", path: "/create-will/assets", icon: Landmark },
  { name: "Beneficiaries", path: "/create-will/beneficiaries", icon: Gift },
  { name: "Asset Allocation", path: "/create-will/asset-allocation", icon: PieChart },
  { name: "Executor", path: "/create-will/executor", icon: UserCheck },
  { name: "Review", path: "/create-will/review", icon: FileCheck },
];

export function SidebarProgress() {
  const pathname = usePathname();
  const router = useRouter();
  const { formData, saveAndGoTo, setFormData } = useWillForm();

  const currentStepIndex = steps.findIndex((step) => pathname === step.path);

  const getStepKey = (path: string) => {
    if (path.includes('personal-information')) return 'personalInfo';
    if (path.includes('family-details')) return 'familyDetails';
    if (path.includes('assets')) return 'assets';
    if (path.includes('beneficiaries')) return 'beneficiaries';
    if (path.includes('asset-allocation')) return 'assetAllocation';
    if (path.includes('executor')) return 'executor';
    if (path.includes('review')) return 'review';
    return null;
  };

  const handleStepClick = (path: string) => {
    const currentStepKey = getStepKey(pathname);

    // Get the current form data from the form state, not context, to ensure it's up-to-date
    // This requires a way to access form.getValues() here, which is tricky.
    // The current saveAndGoTo saves context data, which is fine for button clicks.
    // For now, we'll rely on the existing saveAndGoTo logic which saves on button clicks.
    // A more robust solution might involve a shared "save" function.
    
    // For now, let's just navigate. The context should be up-to-date from previous navigations.
    router.push(path);
  };
  
  return (
    <nav className="space-y-1 sticky top-24">
      {steps.map((step, stepIdx) => {
        const isCompleted = stepIdx < currentStepIndex;
        const isCurrent = stepIdx === currentStepIndex;

        return (
          <button
            key={step.name}
            onClick={() => handleStepClick(step.path)}
            className={cn(
              "group flex w-full items-center rounded-md p-3 text-left text-sm font-medium transition-colors duration-200",
              isCurrent
                ? "bg-primary text-primary-foreground"
                : isCompleted
                ? "bg-card text-foreground hover:bg-muted"
                : "bg-card text-muted-foreground hover:bg-muted"
            )}
            aria-current={isCurrent ? "step" : undefined}
          >
            <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full mr-4 text-xs font-bold shrink-0",
                 isCurrent
                ? "bg-primary-foreground text-primary"
                : isCompleted
                ? "bg-primary text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground"
            )}>
              {isCompleted ? <FileCheck className="h-4 w-4" /> : stepIdx + 1}
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-foreground/60 group-hover:text-foreground">Step {stepIdx + 1}</span>
              <span className={cn(
                 "font-semibold",
                 isCurrent ? "text-primary-foreground" : "text-foreground"
              )}>{step.name}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
