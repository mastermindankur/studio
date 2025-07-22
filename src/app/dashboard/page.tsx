
"use client";

import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { format } from "date-fns";
import { PlusCircle, FileText, Download, Edit, Loader2, PlayCircle, CheckCircle, ArrowRight, User, Users, Landmark, Gift, PieChart, UserCheck } from "lucide-react";
import { useWillForm, WillFormProvider, type WillFormData, initialData } from "@/context/WillFormContext";
import { useRouter } from "next/navigation";
import { generatePdf } from "@/lib/pdfGenerator";
import { WillDocument } from "@/components/create-will/will-document";
import { getWillSection, getWillListSection } from "../actions/will-draft";

const checklistSteps = [
    { title: "Personal Information", path: "/create-will/personal-information", reviewPath: "/create-will/personal-information/review", icon: User, key: 'personalInfo' },
    { title: "Family Details", path: "/create-will/family-details", reviewPath: "/create-will/family-details/review", icon: Users, key: 'familyDetails' },
    { title: "Your Assets", path: "/create-will/assets", icon: Landmark, key: 'assets' },
    { title: "Your Beneficiaries", path: "/create-will/beneficiaries", icon: Gift, key: 'beneficiaries' },
    { title: "Asset Allocation", path: "/create-will/asset-allocation", icon: PieChart, key: 'assetAllocation' },
    { title: "Executor & Signing", path: "/create-will/executor", icon: UserCheck, key: 'executor' },
];

function isStepComplete(stepKey: string, draftData: WillFormData | null): boolean {
    if (!draftData) return false;
    
    const data = draftData[stepKey as keyof WillFormData] as any;
    if (!data) return false;
    
    switch (stepKey) {
        case 'personalInfo':
            return !!data.fullName && !!data.dob && !!data.aadhar && !!data.gender && !!data.fatherHusbandName && !!data.religion && !!data.occupation && !!data.address && !!data.email && !!data.mobile;
        case 'familyDetails':
            if (!data.maritalStatus) return false;
            if (data.maritalStatus === 'married' && !data.spouseName) return false;
            return true;
        case 'assets':
            return Array.isArray(data.assets) && data.assets.length > 0;
        case 'beneficiaries':
             return Array.isArray(data.beneficiaries); // Considered complete even if empty, as it's optional.
        case 'assetAllocation':
            return Array.isArray(data.allocations) && data.allocations.length > 0;
        case 'executor':
            return !!data.primaryExecutor?.fullName && !!data.city && !!data.state;
        default:
            return false;
    }
}


function DashboardPageContent() {
  const { user, loading: authLoading } = useAuth();
  const [draft, setDraft] = useState<WillFormData | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const { loadWill } = useWillForm();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      const fetchDraft = async () => {
        setLoadingDraft(true);
        try {
            const [personalInfo, familyDetails, assets, beneficiaries, assetAllocation, executor] = await Promise.all([
                getWillSection(user.uid, 'personalInfo'),
                getWillSection(user.uid, 'familyDetails'),
                getWillListSection(user.uid, 'assets'),
                getWillListSection(user.uid, 'beneficiaries'),
                getWillListSection(user.uid, 'assetAllocations'),
                getWillSection(user.uid, 'executor')
            ]);
            
            const draftData: WillFormData = {
                personalInfo: personalInfo || initialData.personalInfo,
                familyDetails: familyDetails || initialData.familyDetails,
                assets: { assets: assets || initialData.assets.assets },
                beneficiaries: { beneficiaries: beneficiaries || initialData.beneficiaries.beneficiaries },
                assetAllocation: { allocations: assetAllocation || initialData.assetAllocation.allocations },
                executor: executor || initialData.executor
            };
            setDraft(draftData);

        } catch (error) {
          console.error("Error fetching will draft:", error);
          setDraft(initialData);
        } finally {
          setLoadingDraft(false);
        }
      };
      fetchDraft();
    } else if (!authLoading) {
      setLoadingDraft(false);
    }
  }, [user, authLoading]);
  
  const handleStepClick = (step: typeof checklistSteps[0]) => {
    if (draft) {
      loadWill(draft);
    } else {
      loadWill(initialData); // Load initial data if no draft exists
    }

    const isComplete = isStepComplete(step.key, draft);

    if(isComplete && step.reviewPath) {
      router.push(step.reviewPath);
    } else {
      router.push(step.path);
    }
  };
  
  const handleReview = () => {
    if (draft) {
        loadWill(draft);
    }
    router.push("/create-will/review");
  }

  if (authLoading || (user && loadingDraft)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Skeleton className="h-10 w-1/2 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
     return (
        <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
            <h1 className="font-headline text-3xl font-bold text-primary mb-4">Access Denied</h1>
            <p className="text-lg text-foreground/80 mb-8">Please log in to view your dashboard.</p>
            <Button asChild>
                <Link href="/login">Go to Login</Link>
            </Button>
        </main>
        <Footer />
        </div>
     )
  }

  const allStepsComplete = checklistSteps.every(step => isStepComplete(step.key, draft));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
                 <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-primary text-center sm:text-left">
                    Create Your Will
                 </h1>
                 <p className="text-foreground/80 mt-2 max-w-2xl text-center sm:text-left">
                    Complete each section at your own pace. Your progress is saved automatically.
                 </p>
            </div>
            <Button size="lg" onClick={handleReview} disabled={!allStepsComplete}>
                Review & Finalize Will <ArrowRight className="ml-2 h-5 w-5"/>
            </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklistSteps.map(step => {
                const isComplete = isStepComplete(step.key, draft);
                return (
                    <Card 
                        key={step.path} 
                        onClick={() => handleStepClick(step)}
                        className="hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="bg-primary/10 p-3 rounded-full">
                                <step.icon className="w-6 h-6 text-primary"/>
                               </div>
                               <CardTitle className="text-xl">{step.title}</CardTitle>
                            </div>
                            {isComplete && <CheckCircle className="w-6 h-6 text-green-500" />}
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end">
                             <p className="text-sm text-muted-foreground">
                                {isComplete ? "Section completed. Click to review." : "Click to start this section."}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
        
         <div className="mt-12 border-t pt-8">
            <h2 className="font-headline text-2xl font-bold text-primary mb-4">Finished Wills</h2>
            <p className="text-foreground/80 mb-6">Once you finalize a will, it will appear here for download.</p>
            {/* Logic to display completed wills can be added here */}
             <Card className="text-center py-12 px-6 bg-card/50">
                <CardHeader>
                    <CardTitle>No Finalized Wills Yet</CardTitle>
                    <CardDescription>
                       Complete all the steps above and click "Review & Finalize" to create your first official will.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>


      </main>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
    return (
        <WillFormProvider>
            <DashboardPageContent />
        </WillFormProvider>
    )
}
