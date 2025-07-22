
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { AddAllocationModal } from "./add-allocation-modal";
import { useWillForm } from "@/context/WillFormContext";

interface AssetAllocationCardProps {
  asset: any;
  allocations: any[];
  onEdit: (assetId: string) => void;
  onRemove: (assetId: string) => void;
  allBeneficiaries: any[];
  familyDetails: any;
}

export function AssetAllocationCard({ asset, allocations, onEdit, onRemove, allBeneficiaries, familyDetails }: AssetAllocationCardProps) {
  
  const totalPercentage = allocations.reduce((sum, alloc) => sum + (alloc.percentage || 0), 0);
  
  const getBeneficiaryName = (beneficiaryId: string) => {
    const beneficiariesMap = new Map();
    allBeneficiaries.forEach(b => beneficiariesMap.set(b.id, { id: b.id, name: b.name }));
    if (familyDetails?.spouseName) {
      const spouseId = `spouse-${familyDetails.spouseName.replace(/\s+/g, '-').toLowerCase()}`;
      beneficiariesMap.set(spouseId, { id: spouseId, name: `${familyDetails.spouseName} (Spouse)` });
    }
    familyDetails?.children?.forEach((c: any) => {
      if (c.name) {
        const childId = `child-${c.name.replace(/\s+/g, '-').toLowerCase()}`;
        beneficiariesMap.set(childId, { id: childId, name: `${c.name} (Child)` });
      }
    });
    return beneficiariesMap.get(beneficiaryId)?.name || "Unknown";
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{asset.details.description || asset.type}</CardTitle>
              <CardDescription>Value: ₹{new Intl.NumberFormat('en-IN').format(asset.details.value || 0)}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(asset.id)}><Edit className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onRemove(asset.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          {allocations.map(alloc => (
            <div key={alloc.id || alloc.beneficiaryId} className="flex justify-between items-center text-sm">
              <span>{getBeneficiaryName(alloc.beneficiaryId)}</span>
              <Badge variant="secondary">{alloc.percentage}%</Badge>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <div className="w-full flex justify-between text-sm text-muted-foreground">
            <span>Allocated</span>
            <span>{totalPercentage}% / 100%</span>
          </div>
          <Progress value={totalPercentage} className={totalPercentage > 100 ? '[&>div]:bg-destructive' : ''}/>
          {totalPercentage > 100 && <p className="text-xs text-destructive">Asset is over-allocated. Please fix.</p>}
          {totalPercentage < 100 && <p className="text-xs text-muted-foreground">{(100-totalPercentage).toFixed(2)}% is unallocated and will go to the residue of your estate.</p>}
        </CardFooter>
      </Card>
    </>
  );
}
