
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
    
    // Use a direct reference to the section data
    const sectionData = draftData[stepKey as keyof WillFormData] as any;

    if (!sectionData) return false;
    
    switch (stepKey) {
        case 'personalInfo':
            return !!sectionData.fullName && !!sectionData.dob && !!sectionData.aadhar && !!sectionData.gender && !!sectionData.fatherHusbandName && !!sectionData.religion && !!sectionData.occupation && !!sectionData.address && !!sectionData.email && !!sectionData.mobile;
        case 'familyDetails':
            if (!sectionData.maritalStatus) return false;
            if (sectionData.maritalStatus === 'married' && (!sectionData.spouseName || sectionData.spouseName.trim() === '')) return false;
            return true;
        case 'assets':
             // Check if 'assets' object and its nested 'assets' array exist and have length
            return Array.isArray(sectionData.assets) && sectionData.assets.length > 0;
        case 'beneficiaries':
             // Beneficiaries step is complete if family details are filled, OR other beneficiaries are added.
             const familyDetailsComplete = isStepComplete('familyDetails', draftData);
             if (!familyDetailsComplete) return false;

             const hasFamily = !!draftData.familyDetails?.spouseName || (Array.isArray(draftData.familyDetails?.children) && draftData.familyDetails.children.some((c: any) => c.name && c.name.trim() !== ''));
             const hasOthers = Array.isArray(sectionData.beneficiaries) && sectionData.beneficiaries.length > 0;
             return hasFamily || hasOthers;
        case 'assetAllocation':
            return Array.isArray(sectionData.allocations) && sectionData.allocations.length > 0;
        case 'executor':
            return !!sectionData.primaryExecutor?.fullName && !!sectionData.city && !!sectionData.state;
        default:
            return false;
    }
}


function DashboardPageContent() {
  const { user, loading: authLoading } = useAuth();
  const [draft, setDraft] = useState<WillFormData | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [finishedWills, setFinishedWills] = useState<any[]>([]);
  const [loadingFinishedWills, setLoadingFinishedWills] = useState(true);
  const [willToRender, setWillToRender] = useState<any | null>(null);
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
                getWillSection(user.uid, 'assetAllocation'),
                getWillSection(user.uid, 'executor')
            ]);
            
            const draftData: WillFormData = {
                ...initialData,
                personalInfo: personalInfo || initialData.personalInfo,
                familyDetails: familyDetails || initialData.familyDetails,
                assets: { assets: assets || [] },
                beneficiaries: { beneficiaries: beneficiaries || [] },
                assetAllocation: assetAllocation || initialData.assetAllocation,
                executor: executor || initialData.executor,
            };
            setDraft(draftData);

        } catch (error) {
          console.error("Error fetching will draft:", error);
          setDraft(initialData);
        } finally {
          setLoadingDraft(false);
        }
      };

      const fetchFinishedWills = async () => {
        setLoadingFinishedWills(true);
        try {
          const q = query(collection(db, "wills"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const wills = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFinishedWills(wills);
        } catch (error) {
          console.error("Error fetching finished wills:", error);
        } finally {
          setLoadingFinishedWills(false);
        }
      };

      fetchDraft();
      fetchFinishedWills();
    } else if (!authLoading) {
      setLoadingDraft(false);
      setLoadingFinishedWills(false);
    }
  }, [user, authLoading]);

  const handleDownloadPdf = async (willData: any) => {
    setWillToRender(willData.willData);
    // Use a timeout to allow the state to update and the hidden component to render
    setTimeout(async () => {
      const date = (willData.createdAt as Timestamp).toDate();
      const dateStr = format(date, 'yyyy-MM-dd');
      const pdfFilename = `iWills-in_Will_v${willData.version}_${dateStr}.pdf`;
      await generatePdf(`will-document-render-${willData.id}`, pdfFilename);
      setWillToRender(null); // Clean up after rendering
    }, 100);
  };
  
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

  if (authLoading || (user && (loadingDraft || loadingFinishedWills))) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Skeleton className="h-10 w-1/2 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
          </div>
          <div className="mt-12 border-t pt-8">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full" />
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

                const assetCount = draft?.assets?.assets?.length || 0;
                const otherBeneficiaryCount = draft?.beneficiaries?.beneficiaries?.length || 0;
                const spouseCount = (draft?.familyDetails?.spouseName && draft.familyDetails.spouseName.trim() !== '') ? 1 : 0;
                const childCount = draft?.familyDetails?.children?.filter((c:any) => c.name && c.name.trim() !== '').length || 0;
                const totalBeneficiaryCount = otherBeneficiaryCount + spouseCount + childCount;

                let cardDescription = "Click to start this section.";
                if (isComplete) {
                    if (step.key === 'assets' && assetCount > 0) {
                        cardDescription = `${assetCount} asset${assetCount !== 1 ? 's' : ''} added. Click to review.`;
                    } else if (step.key === 'beneficiaries' && totalBeneficiaryCount > 0) {
                        cardDescription = `${totalBeneficiaryCount} beneficiar${totalBeneficiaryCount !== 1 ? 'ies' : 'y'} listed. Click to review.`;
                    } else {
                        cardDescription = "Section completed. Click to review.";
                    }
                }
                
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
                                {cardDescription}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
        
         <div className="mt-12 border-t pt-8">
            <h2 className="font-headline text-2xl font-bold text-primary mb-4">Finished Wills</h2>
            
            {finishedWills.length > 0 ? (
                <div className="space-y-4">
                    {finishedWills.map((will) => (
                        <Card key={will.id} className="flex flex-col sm:flex-row items-center justify-between p-4">
                           <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <FileText className="w-8 h-8 text-primary"/>
                                <div>
                                    <p className="font-semibold">
                                        Will Version {will.version}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Finalized on {format((will.createdAt as Timestamp).toDate(), "PPP")}
                                    </p>
                                </div>
                           </div>
                            <Button onClick={() => handleDownloadPdf(will)}>
                                <Download className="mr-2 h-4 w-4"/>
                                Download PDF
                            </Button>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12 px-6 bg-card/50">
                    <CardHeader>
                        <CardTitle>No Finalized Wills Yet</CardTitle>
                        <CardDescription>
                        Complete all the steps above and click "Review & Finalize" to create your first official will.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}
        </div>
      </main>

      {/* Hidden container for rendering PDFs */}
      <div className="hidden">
        {willToRender && <WillDocument formData={willToRender} id={`will-document-render-${willToRender.id}`} />}
      </div>
      
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
