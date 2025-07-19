
"use client";

import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { format } from "date-fns";
import { PlusCircle, FileText, Download, Edit, Loader2 } from "lucide-react";
import { useWillForm, WillFormProvider } from "@/context/WillFormContext";
import { useRouter } from "next/navigation";
import { generatePdf } from "@/lib/pdfGenerator";
import { WillDocument } from "@/components/create-will/will-document";


interface Will {
    id: string;
    version: number;
    createdAt: string;
    data: any;
}

function DashboardPageContent() {
  const { user, loading: authLoading } = useAuth();
  const [wills, setWills] = useState<Will[]>([]);
  const [loadingWills, setLoadingWills] = useState(true);
  const { loadWill } = useWillForm();
  const router = useRouter();
  const [pdfGeneratingWillId, setPdfGeneratingWillId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchWills = async () => {
        try {
          const willsRef = collection(db, "wills");
          const q = query(willsRef, where("userId", "==", user.uid), orderBy("version", "desc"));
          const querySnapshot = await getDocs(q);
          const userWills: Will[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            userWills.push({
              id: doc.id,
              version: data.version,
              createdAt: format(data.createdAt.toDate(), "PPPp"),
              data: data.willData,
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
          await generatePdf(will.data, `iWills-in_Will_v${will.version}.pdf`);
      } catch (error) {
          console.error("Error generating PDF:", error);
      } finally {
          setPdfGeneratingWillId(null);
      }
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
            <Button asChild>
                <Link href="/create-will/personal-information"><PlusCircle className="mr-2"/>Create New Will</Link>
            </Button>
        </div>

        {loadingWills ? (
            <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        ) : wills.length > 0 ? (
            <div className="space-y-6">
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
        ) : (
             <Card className="text-center py-12">
                <CardHeader>
                    <CardTitle>You haven't created a Will yet</CardTitle>
                    <CardDescription>
                        Get started today to protect your family's future.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild size="lg">
                        <Link href="/create-will/personal-information">Create Your First Will</Link>
                    </Button>
                </CardContent>
            </Card>
        )}
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
