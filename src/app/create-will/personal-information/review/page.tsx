
"use client";

import { useWillForm } from "@/context/WillFormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Edit, User, CheckCircle } from "lucide-react";

export default function ReviewPersonalInformationPage() {
  const router = useRouter();
  const { formData, loading } = useWillForm();
  const { personalInfo } = formData;

  const handleEdit = () => {
    router.push("/create-will/personal-information");
  };

  const handleConfirm = () => {
    // Navigate to the dashboard as requested
    router.push("/dashboard");
  };
  
  const DetailItem = ({ label, value }: { label: string, value: string | undefined }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value || 'Not Provided'}</p>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-primary"/>
                <CardTitle className="text-2xl font-bold text-primary font-headline">Review Personal Information</CardTitle>
            </div>
             <Button variant="outline" size="sm" onClick={handleEdit}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-6">Please review the details below to ensure everything is correct before proceeding.</p>
            <div className="space-y-6 rounded-lg border p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <DetailItem label="Full Name" value={personalInfo?.fullName} />
                    <DetailItem label="Gender" value={personalInfo?.gender} />
                    <DetailItem label="Date of Birth" value={personalInfo?.dob ? format(new Date(personalInfo.dob), "PPP") : ''} />
                    <DetailItem label="Father/Husband Name" value={personalInfo?.fatherHusbandName} />
                    <DetailItem label="Religion" value={personalInfo?.religion} />
                    <DetailItem label="Occupation" value={personalInfo?.occupation} />
                    <DetailItem label="Aadhar" value={personalInfo?.aadhar} />
                    <DetailItem label="Mobile" value={personalInfo?.mobile} />
                    <DetailItem label="Email" value={personalInfo?.email} />
                </div>
                 <div className="pt-4 border-t">
                     <DetailItem label="Address" value={personalInfo?.address} />
                 </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button size="lg" onClick={handleConfirm}>
                <CheckCircle className="mr-2 h-5 w-5" />
                Confirm &amp; Go to Dashboard
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
