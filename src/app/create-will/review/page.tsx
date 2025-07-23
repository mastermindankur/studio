
"use client";

import { useWillForm } from "@/context/WillFormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, FileCheck, User, Users, Landmark, Gift, PieChart, UserCheck, Loader2, Save, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { WillDocument } from "@/components/create-will/will-document";
import { useState } from "react";
import { saveWill } from "@/app/actions/will";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { generatePdf as GeneratePdfType } from "@/lib/pdfGenerator";


export default function ReviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { formData, clearForm, loading } = useWillForm();
  const [isFinalizing, setIsFinalizing] = useState(false);

  const {
    personalInfo,
    familyDetails,
    assets,
    beneficiaries,
    assetAllocation,
    executor,
    version,
    createdAt
  } = formData;

  const isEditing = !!version;

  const handleEdit = (path: string) => {
    router.push(`/create-will/${path}`);
  };

  const handleFinalize = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to save a will." });
        return;
    }
    
    setIsFinalizing(true);
    
    try {
        // Save data to Firestore first
        const saveData = { ...formData, userId: user.uid };
        const result = await saveWill(saveData);

        if (result.success && result.version) {
            toast({
                title: "Will Saved Successfully!",
                description: "Your will has been saved. Your PDF download will begin shortly.",
            });
            
            const now = new Date();
            const dateStr = format(now, 'yyyy-MM-dd');
            const timeStr = format(now, 'HH-mm');
            const pdfFilename = `iWills-in_Will_v${result.version}_${dateStr}_${timeStr}.pdf`;

            // Dynamically import and generate PDF only on the client-side
            const { generatePdf }: { generatePdf: GeneratePdfType } = await import('@/lib/pdfGenerator');
            await generatePdf(`will-document-render`, pdfFilename);

            clearForm();
            router.push("/dashboard");
        } else {
             toast({ variant: "destructive", title: "Save Failed", description: result.message });
        }
    } catch (error) {
        console.error("Finalization error:", error);
        toast({ variant: "destructive", title: "An Error Occurred", description: "Could not finalize your will. Please try again." });
    } finally {
        setIsFinalizing(false);
    }
  };
  
  const handleSaveAndExit = () => {
    router.push("/dashboard");
  }

  const getAssetName = (id: string) => {
    const asset = assets?.assets.find((a: any) => a.id === id);
    if (asset && asset.details) return asset.details.description;
    
    return 'N/A';
  };

  const getBeneficiaryName = (id: string) => {
    const beneficiary = beneficiaries?.beneficiaries.find((b: any) => b.id === id);
    if (beneficiary) return beneficiary.name;
    
    const spouseId = `spouse-${familyDetails?.spouseName?.replace(/\s+/g, '-').toLowerCase()}`;
    if (id === spouseId) return `${familyDetails.spouseName} (Spouse)`;

    const child = familyDetails?.children?.find((c: any) => `child-${c.name?.replace(/\s+/g, '-').toLowerCase()}` === id);
    if (child) return `${child.name} (Child)`;

    return 'N/A';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg space-y-8">
          <div className="text-center mb-8">
            <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
            <Skeleton className="h-9 w-3/4 mx-auto" />
            <Skeleton className="h-5 w-1/2 mx-auto mt-2" />
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3 w-full">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                  <Skeleton className="h-9 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3 w-full">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                  <Skeleton className="h-9 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hidden component for PDF generation */}
      <div className="hidden">
        <WillDocument formData={formData} id="will-document-render" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
              <FileCheck className="w-12 h-12 text-primary mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-primary font-headline">Review & Finalize</h1>
              {isEditing && (
                 <p className="text-foreground/80 mt-2">
                    Editing Will Version {version} (created on {createdAt ? format(new Date(createdAt), "PPP") : 'N/A'})
                 </p>
              )}
          </div>
        
          <div className="space-y-8">
              <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-primary"/>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEdit("personal-information")}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div><strong>Full Name:</strong> {personalInfo?.fullName}</div>
                  <div><strong>Gender:</strong> {personalInfo?.gender}</div>
                  <div><strong>Date of Birth:</strong> {personalInfo?.dob ? format(new Date(personalInfo.dob), "PPP") : 'N/A'}</div>
                  <div><strong>Father/Husband Name:</strong> {personalInfo?.fatherHusbandName}</div>
                  <div><strong>Religion:</strong> {personalInfo?.religion}</div>
                  <div><strong>Aadhar:</strong> {personalInfo?.aadhar}</div>
                  <div><strong>Occupation:</strong> {personalInfo?.occupation}</div>
                  <div><strong>Mobile:</strong> {personalInfo?.mobile}</div>
                  <div className="md:col-span-2"><strong>Address:</strong> {personalInfo?.address}</div>
                  <div className="md:col-span-2"><strong>Email:</strong> {personalInfo?.email}</div>
              </CardContent>
              </Card>

              <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary"/>
                  <CardTitle className="text-xl">Family Details</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEdit("family-details")}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                  <p><strong>Marital Status:</strong> {familyDetails?.maritalStatus}</p>
                  {familyDetails?.maritalStatus === 'married' && <p><strong>Spouse Name:</strong> {familyDetails?.spouseName}</p>}
                  <div>
                  <strong>Children:</strong>
                  {familyDetails?.children && familyDetails.children.length > 0 && familyDetails.children.some(c => c.name) ? (
                      <ul className="list-disc pl-5 mt-1">
                      {familyDetails.children.map((child: any, index: number) => child.name && <li key={index}>{child.name}</li>)}
                      </ul>
                  ) : " No children listed."}
                  </div>
              </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                      <Landmark className="w-6 h-6 text-primary"/>
                      <CardTitle className="text-xl">Assets</CardTitle>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleEdit("assets")}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                      {assets?.assets.map((asset: any, index: number) => (
                          <div key={index} className="p-3 border rounded-md">
                              <p><strong>{asset.details.description}</strong> ({asset.type})</p>
                              <p>Value: ₹{asset.details.value || 'Not specified'}</p>
                          </div>
                      ))}
                  </CardContent>
                  </Card>

                  <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                      <Gift className="w-6 h-6 text-primary"/>
                      <CardTitle className="text-xl">Beneficiaries</CardTitle>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleEdit("beneficiaries")}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                      {beneficiaries?.beneficiaries.map((ben: any, index: number) => (
                          <div key={index}>
                              <strong>{ben.name}</strong> ({ben.relationship})
                          </div>
                      ))}
                  </CardContent>
                  </Card>
              </div>


              <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                  <PieChart className="w-6 h-6 text-primary"/>
                  <CardTitle className="text-xl">Asset Allocation</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEdit("asset-allocation")}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                  {assetAllocation?.allocations.map((alloc: any, index: number) => (
                      <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                          <span className="truncate pr-2"><strong>{getAssetName(alloc.assetId)}</strong> to <strong>{getBeneficiaryName(alloc.beneficiaryId)}</strong></span>
                          <Badge>{alloc.percentage}%</Badge>
                      </div>
                  ))}
              </CardContent>
              </Card>

              <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-primary"/>
                  <CardTitle className="text-xl">Executor & Signing</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEdit("executor")}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                  <div>
                      <h4 className="font-semibold mb-2">Primary Executor</h4>
                      <p><strong>Name:</strong> {executor?.primaryExecutor.fullName}</p>
                      <p><strong>Address:</strong> {executor?.primaryExecutor.address}</p>
                      <p><strong>Contact:</strong> {executor?.primaryExecutor.email}, {executor?.primaryExecutor.mobile}</p>
                  </div>
                  {executor?.addSecondExecutor && executor?.secondExecutor && (
                      <div>
                          <Separator className="my-4"/>
                          <h4 className="font-semibold mb-2">Second Executor</h4>
                          <p><strong>Name:</strong> {executor?.secondExecutor.fullName}</p>
                          <p><strong>Address:</strong> {executor?.secondExecutor.address}</p>
                          <p><strong>Contact:</strong> {executor?.secondExecutor.email}, {executor?.secondExecutor.mobile}</p>
                      </div>
                  )}
                  {executor?.specialInstructions && (
                      <div>
                          <Separator className="my-4"/>
                          <h4 className="font-semibold mb-2">Special Instructions</h4>
                          <p className="whitespace-pre-wrap">{executor.specialInstructions}</p>
                      </div>
                  )}
                   {(executor?.city || executor?.state) && (
                      <div>
                          <Separator className="my-4"/>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-4 w-4"/> Place of Signing</h4>
                          <p><strong>Location:</strong> {executor.city}, {executor.state}</p>
                      </div>
                    )}
              </CardContent>
              </Card>

          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4">
              <Button size="lg" variant="secondary" onClick={handleSaveAndExit} disabled={isFinalizing} className="w-full sm:w-auto">
                <Save className="mr-2 h-5 w-5" /> Save & Exit
              </Button>
              <Button size="lg" onClick={handleFinalize} disabled={isFinalizing} className="w-full sm:w-auto">
              {isFinalizing ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
              ) : (
                  <CheckCircle className="mr-2 h-5 w-5"/>
              )}
              {isFinalizing ? 'Finalizing...' : 'Finalize & Submit'}
              </Button>
          </div>
        </div>
      </div>
    </>
  );
}
