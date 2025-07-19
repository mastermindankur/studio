
"use client";

import { useWillForm } from "@/context/WillFormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, FileCheck, User, Users, Landmark, Gift, PieChart, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();
  const { formData, clearForm, saveAndGoTo } = useWillForm();

  const {
    personalInfo,
    familyDetails,
    assets,
    beneficiaries,
    assetAllocation,
    executor,
  } = formData;

  const handleEdit = (path: string) => {
    saveAndGoTo(formData, `/create-will/${path}`);
  };

  const handleFinalize = () => {
    // In a real app, this would submit the data to the backend.
    // For now, we'll clear the form data and navigate to the dashboard.
    clearForm();
    alert("Your Will has been successfully created and saved to your dashboard!"); // Placeholder for a success toast
    router.push("/dashboard");
  };
  
  const handleBack = () => {
    saveAndGoTo(formData, "/create-will/executor");
  }

  const getAssetName = (id: string) => assets?.assets.find((a: any) => a.id === id)?.description || 'N/A';
  const getBeneficiaryName = (id: string) => beneficiaries?.beneficiaries.find((b: any) => b.id === id)?.name || 'N/A';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-8 rounded-lg shadow-lg mt-8">
        <div className="text-center mb-8">
            <FileCheck className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary font-headline">Review & Finalize</h1>
            <p className="text-foreground/80">Step 7 of 7</p>
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
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                {familyDetails?.children && familyDetails.children.length > 0 ? (
                    <ul className="list-disc pl-5 mt-1">
                    {familyDetails.children.map((child: any, index: number) => <li key={index}>{child.name}</li>)}
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
                            <p><strong>{asset.description}</strong> ({asset.type})</p>
                            <p>Value: ₹{asset.value || 'Not specified'}</p>
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
                        <span><strong>{getAssetName(alloc.assetId)}</strong> to <strong>{getBeneficiaryName(alloc.beneficiaryId)}</strong></span>
                        <Badge>{alloc.percentage}%</Badge>
                    </div>
                ))}
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-primary"/>
                <CardTitle className="text-xl">Executor Details</CardTitle>
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
            </CardContent>
            </Card>

        </div>
        
        <div className="mt-12 flex justify-between">
            <Button size="lg" variant="outline" onClick={handleBack}>Back</Button>
            <Button size="lg" onClick={handleFinalize}>
            <CheckCircle className="mr-2 h-5 w-5"/>
            Finalize & Submit
            </Button>
        </div>
      </div>
    </div>
  );
}
