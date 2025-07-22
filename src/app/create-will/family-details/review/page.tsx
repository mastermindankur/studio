
"use client";

import { useWillForm } from "@/context/WillFormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Edit, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReviewFamilyDetailsPage() {
  const router = useRouter();
  const { formData, loading } = useWillForm();
  const { familyDetails } = formData;

  const handleEdit = () => {
    router.push("/create-will/family-details");
  };

  const handleConfirm = () => {
    router.push("/dashboard");
  };
  
  const DetailItem = ({ label, value }: { label: string, value: string | undefined }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground capitalize">{value || 'Not Provided'}</p>
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
                <Users className="w-8 h-8 text-primary"/>
                <CardTitle className="text-2xl font-bold text-primary font-headline">Review Family Details</CardTitle>
            </div>
             <Button variant="outline" size="sm" onClick={handleEdit}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-6">Please review your family details to ensure everything is correct.</p>
            <div className="space-y-6 rounded-lg border p-6">
                <DetailItem label="Marital Status" value={familyDetails?.maritalStatus} />
                
                {familyDetails?.maritalStatus === 'married' && (
                    <DetailItem label="Spouse's Name" value={familyDetails?.spouseName} />
                )}

                <div>
                    <p className="text-sm text-muted-foreground">Children</p>
                    {familyDetails?.children && familyDetails.children.length > 0 && familyDetails.children.some((c:any) => c.name) ? (
                        <div className="mt-2 space-y-2">
                            {familyDetails.children.map((child: any, index: number) => (
                                child.name && (
                                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                        <span className="font-medium text-foreground">{child.name}</span>
                                        <Badge variant="secondary">Child</Badge>
                                    </div>
                                )
                            ))}
                        </div>
                    ) : (
                        <p className="font-medium text-foreground">No children listed.</p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button size="lg" onClick={handleConfirm}>
                <CheckCircle className="mr-2 h-5 w-5" />
                Confirm & Go to Dashboard
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
