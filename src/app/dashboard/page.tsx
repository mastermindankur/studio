
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
import { PlusCircle, FileText, Download, Edit, Loader2, PlayCircle } from "lucide-react";
import { useWillForm, WillFormProvider, WillFormData } from "@/context/WillFormContext";
import { useRouter } from "next/navigation";
import { generatePdf } from "@/lib/pdfGenerator";
import { WillDocument } from "@/components/create-will/will-document";


interface Will {
    id: string;
    version: number;
    createdAt: string;
    data: any;
}

const steps = [
    { key: 'personalInfo', path: '/create-will/personal-information' },
    { key: 'familyDetails', path: '/create-will/family-details' },
    { key: 'assets', path: '/create-will/assets' },
    { key: 'beneficiaries', path: '/create-will/beneficiaries' },
    { key: 'assetAllocation', path: '/create-will/asset-allocation' },
    { key: 'executor', path: '/create-will/executor' },
    { key: 'review', path: '/create-will/review' },
];

function DashboardPageContent() {
  const { user, loading: authLoading } = useAuth();
  const [wills, setWills] = useState<Will[]>([]);
  const [loadingWills, setLoadingWills] = useState(true);
  const [inProgressWillPath, setInProgressWillPath] = useState<string | null>(null);
  const { loadWill, clearForm } = useWillForm();
  const router = useRouter();
  const [pdfGeneratingWillId, setPdfGeneratingWillId] = useState<string | null>(null);

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const storageKey = `willFormData_${user.uid}`;
      const savedDataRaw = localStorage.getItem(storageKey);
      if (savedDataRaw) {
          try {
              const savedData: WillFormData = JSON.parse(savedDataRaw);
              // Simple check to see if it's not just initial data
              if (savedData.personalInfo && savedData.personalInfo.fullName) {
                  // Determine where to resume
                  let lastCompletedStepIndex = -1;
                  for (let i = 0; i < steps.length - 1; i++) { // -1 to exclude review step
                      const stepKey = steps[i].key as keyof WillFormData;
                      const stepData = savedData[stepKey];
                      // This is a naive check. A real app would have better validation.
                      if (stepData && Object.values(stepData).some(v => v && (!Array.isArray(v) || v.length > 0))) {
                          lastCompletedStepIndex = i;
                      }
                  }
                  const resumePath = steps[lastCompletedStepIndex + 1]?.path || steps[0].path;
                  setInProgressWillPath(resumePath);
              }
          } catch (e) {
              console.error("Could not parse in-progress will data", e);
          }
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchWills = async () => {
        setLoadingWills(true);
        try {
          const willsRef = collection(db, "wills");
          const q = query(willsRef, where("userId", "==", user.uid), orderBy("version", "desc"));
          const querySnapshot = await getDocs(q);
          const userWills: Will[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const willData = data.willData;
            
            // Convert Firestore Timestamp to JS Date for dob
            if (willData?.personalInfo?.dob instanceof Timestamp) {
                willData.personalInfo.dob = willData.personalInfo.dob.toDate();
            }

            userWills.push({
              id: doc.id,
              version: data.version,
              createdAt: format(data.createdAt.toDate(), "PPPp"),
              data: willData,
            });
          });
          setWills(userWills);
        } catch (error) {
          console.error("Error fetching wills: ", error);
        } finally {
          setLoadingWills(false);
        }
      };
      fetchWills();
    } else if (!authLoading) {
      setLoadingWills(false);
    }
  }, [user, authLoading]);
  
  const handleEdit = (willData: any) => {
    loadWill(willData);
    router.push("/create-will/personal-information");
  };

  const handleDownloadPdf = async (will: Will) => {
      setPdfGeneratingWillId(will.id);
      try {
          await generatePdf(`will-doc-${will.id}`, `iWills-in_Will_v${will.version}.pdf`);
      } catch (error) {
          console.error("Error generating PDF:", error);
      } finally {
          setPdfGeneratingWillId(null);
      }
  };

  const handleCreateNew = () => {
    clearForm();
    router.push('/create-will/personal-information');
  };

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Skeleton className="h-10 w-1/2 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary">
            Welcome, {user.displayName || user.email}
            </h1>
            <Button onClick={handleCreateNew}><PlusCircle className="mr-2"/>Create New Will</Button>
        </div>

        {inProgressWillPath && (
             <Card className="mb-8 bg-primary/10 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center text-primary"><PlayCircle className="mr-2"/> Resume Making Your Will</CardTitle>
                    <CardDescription>You have an unfinished will. Pick up where you left off.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href={inProgressWillPath}>Continue Will</Link>
                    </Button>
                </CardContent>
            </Card>
        )}

        {loadingWills ? (
            <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        ) : wills.length > 0 ? (
            <div className="space-y-6">
                 <h2 className="font-headline text-2xl font-bold text-primary mt-12">Your Saved Wills</h2>
                {wills.map((will) => (
                    <Card key={will.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center"><FileText className="mr-2"/>Will - Version {will.version}</CardTitle>
                                    <CardDescription>Created on: {will.createdAt}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(will)} disabled={pdfGeneratingWillId === will.id}>
                                        {pdfGeneratingWillId === will.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                                        {pdfGeneratingWillId === will.id ? "Generating..." : "PDF"}
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={() => handleEdit(will.data)}>
                                        <Edit className="mr-2 h-4 w-4"/>Edit as New Version
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        ) : !inProgressWillPath ? (
             <Card className="text-center py-12">
                <CardHeader>
                    <CardTitle>You haven't created a Will yet</CardTitle>
                    <CardDescription>
                        Get started today to protect your family's future.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleCreateNew} size="lg">
                        Create Your First Will
                    </Button>
                </CardContent>
            </Card>
        ) : null}
      </main>
      <Footer />
       {/* Hidden component for PDF generation */}
       {wills.map(will => (
        <div key={`doc-${will.id}`} className="hidden">
             <WillDocument formData={will.data} id={`will-doc-${will.id}`} />
        </div>
       ))}
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
