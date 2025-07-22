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
  LayoutDashboard,
} from "lucide-react";
import { Button } from "../ui/button";

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

  const handleStepClick = (path: string) => {
    router.push(path);
  };
  
  return (
    <nav className="space-y-2 sticky top-24">
        <Button variant="outline" className="w-full justify-start mb-4" onClick={() => router.push('/dashboard')}>
            <LayoutDashboard className="mr-2 h-4 w-4"/> Back to Dashboard
        </Button>
      {steps.map((step) => {
        const isCurrent = pathname === step.path;
        const Icon = step.icon;

        return (
          <button
            key={step.name}
            onClick={() => handleStepClick(step.path)}
            className={cn(
              "group flex w-full items-center rounded-md p-3 text-left text-sm font-medium transition-colors duration-200",
              isCurrent
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted"
            )}
            aria-current={isCurrent ? "step" : undefined}
          >
            <Icon className={cn(
                "mr-3 h-5 w-5 shrink-0",
                 isCurrent ? "text-primary-foreground" : "text-primary"
            )}/>
            <span className={cn(
                 "font-semibold",
                 isCurrent ? "text-primary-foreground" : "text-foreground"
            )}>{step.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
