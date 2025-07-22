
"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetFormSchema as assetSchema, type Asset, assetTypes, bankAccountTypes, propertyTypes, vehicleTypes } from "@/lib/schemas/asset-schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Landmark, Home, Car, AreaChart, ShieldCheck, Gem, PlusCircle } from "lucide-react";
import React from "react";

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
  assetData: (Asset & { index?: number }) | null;
}

const assetIcons: { [key: string]: React.ElementType } = {
  "Bank Account": Landmark,
  "Real Estate": Home,
  "Vehicle": Car,
  "Stocks/Investments": AreaChart,
  "Insurance Policy": ShieldCheck,
  "Jewelry/Valuables": Gem,
  "Other": PlusCircle,
};

const defaultValues: Asset = {
  id: '',
  type: "Bank Account",
  details: {
    description: "",
    value: "",
    bankName: "",
    accountType: "Savings",
    accountNumber: "",
    branchAddress: "",
    propertyType: "Flat/Apartment",
    propertyAddress: "",
    surveyNumber: "",
    area: "",
    vehicleType: "Car",
    makeModel: "",
    registrationNumber: "",
    chassisNumber: "",
    brokerName: "",
    dematAccountNumber: "",
    sharesDescription: "",
    insurer: "",
    policyNumber: "",
    sumAssured: "",
    nomineeName: "",
    itemName: "",
    identifyingMarks: "",
    otherType: "",
    otherDetails: ""
  },
};

const descriptionPlaceholders: { [key: string]: string } = {
  "Bank Account": "e.g., HDFC Savings A/C, Kondapur",
  "Real Estate": "e.g., 2BHK Flat at My Home Bhooja",
  "Vehicle": "e.g., Honda City, TS09AB1234",
  "Stocks/Investments": "e.g., Zerodha Demat Account",
  "Insurance Policy": "e.g., LIC Jeevan Anand Policy",
  "Jewelry/Valuables": "e.g., Gold necklace in locker",
  "Other": "e.g., Loan to John Doe"
};

const formatIndianCurrency = (value: string | undefined): string => {
  if (!value || isNaN(Number(value)) || Number(value) === 0) {
    return "";
  }
  const num = Number(value);
  if (num >= 10000000) {
    return `( ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(num / 10000000)} Cr )`;
  }
  if (num >= 100000) {
    return `( ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(num / 100000)} Lakh )`;
  }
  if (num >= 1000) {
    return `( ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(num / 1000)} Thousand )`;
  }
  return `( ${new Intl.NumberFormat('en-IN').format(num)} )`;
};


export function AddAssetModal({ isOpen, onClose, onSave, assetData }: AddAssetModalProps) {
  const form = useForm<Asset>({
    resolver: zodResolver(assetSchema),
    defaultValues: defaultValues
  });

  const assetType = useWatch({ control: form.control, name: 'type' });
  const estimatedValue = useWatch({ control: form.control, name: 'details.value' });
  const formattedValue = formatIndianCurrency(estimatedValue);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isOpen) {
      if (assetData) {
        form.reset({
          ...defaultValues,
          ...assetData,
          details: {
            ...defaultValues.details,
            ...assetData.details,
          },
        });
      } else {
        form.reset(defaultValues);
      }
      isMounted.current = true;
    } else {
      isMounted.current = false;
    }
  }, [assetData, isOpen, form]);
  
  useEffect(() => {
    if (!isMounted.current || !isOpen) return;

    const subscription = form.watch((value, { name }) => {
      if (name === 'type') {
        const currentDetails = form.getValues('details');
        const newDetails = {
            ...defaultValues.details,
            description: currentDetails?.description || "",
            value: currentDetails?.value || "",
        };

        switch(value.type) {
            case "Bank Account": newDetails.accountType = 'Savings'; break;
            case "Real Estate": newDetails.propertyType = 'Flat/Apartment'; break;
            case "Vehicle": newDetails.vehicleType = 'Car'; break;
        }
        
        form.setValue('details', newDetails, { shouldValidate: true, shouldDirty: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [isOpen, form]);


  const onSubmit = (data: Asset) => {
    const finalData = {
        ...data,
        id: assetData?.id || `asset-${Date.now()}`,
        index: assetData?.index,
    };
    onSave(finalData);
  };
  
  const briefDescriptionPlaceholder = descriptionPlaceholders[assetType] || "A short summary to identify this asset";

  const renderAssetFields = () => {
    switch(assetType) {
        case 'Bank Account':
            return (
                <>
                    <FormField control={form.control} name="details.bankName" render={({ field }) => (
                        <FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input placeholder="e.g., State Bank of India" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.accountType" render={({ field }) => (
                        <FormItem><FormLabel>Account Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select account type" /></SelectTrigger></FormControl>
                            <SelectContent>{bankAccountTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.accountNumber" render={({ field }) => (
                        <FormItem><FormLabel>Account Number</FormLabel><FormControl><Input placeholder="Enter full account number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="details.branchAddress" render={({ field }) => (
                        <FormItem><FormLabel>Branch Address</FormLabel><FormControl><Input placeholder="e.g., Main Branch, Hyderabad" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </>
            );
        case 'Real Estate':
             return (
                <>
                    <FormField control={form.control} name="details.propertyType" render={({ field }) => (
                        <FormItem><FormLabel>Property Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger></FormControl>
                            <SelectContent>{propertyTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.propertyAddress" render={({ field }) => (
                        <FormItem><FormLabel>Full Property Address</FormLabel><FormControl><Textarea placeholder="Enter the complete address of the property" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.surveyNumber" render={({ field }) => (
                        <FormItem><FormLabel>Survey/Plot/Khata Number</FormLabel><FormControl><Input placeholder="e.g., Survey No. 123/4B" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.area" render={({ field }) => (
                        <FormItem><FormLabel>Approximate Area</FormLabel><FormControl><Input placeholder="e.g., 1200 sq. ft. or 2 Acres" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </>
            );
        case 'Vehicle':
            return (
                <>
                    <FormField control={form.control} name="details.vehicleType" render={({ field }) => (
                        <FormItem><FormLabel>Vehicle Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select vehicle type" /></SelectTrigger></FormControl>
                            <SelectContent>{vehicleTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.makeModel" render={({ field }) => (
                        <FormItem><FormLabel>Make and Model</FormLabel><FormControl><Input placeholder="e.g., Maruti Suzuki Swift" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.registrationNumber" render={({ field }) => (
                        <FormItem><FormLabel>Registration Number</FormLabel><FormControl><Input placeholder="e.g., TS09XX1234" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.chassisNumber" render={({ field }) => (
                        <FormItem><FormLabel>Chassis Number</FormLabel><FormControl><Input placeholder="Enter vehicle chassis number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </>
            );
        case 'Stocks/Investments':
             return (
                <>
                    <FormField control={form.control} name="details.brokerName" render={({ field }) => (
                        <FormItem><FormLabel>Broker Name</FormLabel><FormControl><Input placeholder="e.g., Zerodha, HDFC Securities" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.dematAccountNumber" render={({ field }) => (
                        <FormItem><FormLabel>Demat Account Number</FormLabel><FormControl><Input placeholder="Enter your Demat A/C number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.sharesDescription" render={({ field }) => (
                        <FormItem><FormLabel>Description of Holdings</FormLabel><FormControl><Textarea placeholder="e.g., 100 shares of Reliance Industries, 50 units of ICICI Prudential Nifty Next 50 Index Fund" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </>
            );
        case 'Insurance Policy':
            return (
                <>
                    <FormField control={form.control} name="details.insurer" render={({ field }) => (
                        <FormItem><FormLabel>Insurance Company</FormLabel><FormControl><Input placeholder="e.g., Life Insurance Corporation of India (LIC)" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.policyNumber" render={({ field }) => (
                        <FormItem><FormLabel>Policy Number</FormLabel><FormControl><Input placeholder="Enter the policy number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.sumAssured" render={({ field }) => (
                        <FormItem><FormLabel>Sum Assured (in ₹)</FormLabel><FormControl><Input type="text" inputMode="numeric" placeholder="e.g., 1000000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="details.nomineeName" render={({ field }) => (
                        <FormItem><FormLabel>Nominee Name (if any)</FormLabel><FormControl><Input placeholder="Name of the nominee" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </>
            );
        case 'Jewelry/Valuables':
            return (
                 <>
                    <FormField control={form.control} name="details.itemName" render={({ field }) => (
                        <FormItem><FormLabel>Item Name/Type</FormLabel><FormControl><Input placeholder="e.g., Gold Necklace, Diamond Ring, Antique Watch" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.identifyingMarks" render={({ field }) => (
                        <FormItem><FormLabel>Description / Identifying Marks</FormLabel><FormControl><Textarea placeholder="e.g., 24-carat gold, approx 50 grams, with 'S' initial engraving. Stored in HDFC Bank Locker No. 123." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </>
            )
        case 'Other':
             return (
                 <>
                    <FormField control={form.control} name="details.otherType" render={({ field }) => (
                        <FormItem><FormLabel>Type of Asset</FormLabel><FormControl><Input placeholder="e.g., Digital Asset, Intellectual Property, Loan Receivable" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="details.otherDetails" render={({ field }) => (
                        <FormItem><FormLabel>Details</FormLabel><FormControl><Textarea placeholder="Provide all necessary details to identify and locate the asset. e.g., For a loan given: 'Personal loan of ₹50,000 given to John Doe on Jan 1, 2023'." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </>
            );
        default:
            return null;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{assetData ? "Edit Asset" : "Add a New Asset"}</DialogTitle>
          <DialogDescription>
            Provide the details for the asset. This information is crucial for clear instructions in your will.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] p-1">
                <div className="space-y-6 p-5">
                    <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Asset Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an asset type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {assetTypes.map((type) => {
                                const Icon = assetIcons[type];
                                return (
                                <SelectItem key={type} value={type}>
                                    <div className="flex items-center gap-2">
                                        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                                        <span>{type}</span>
                                    </div>
                                </SelectItem>
                                )
                            })}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Common Fields */}
                     <FormField
                        control={form.control}
                        name="details.description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Brief Description</FormLabel>
                            <FormDescription>A short, recognizable summary for this asset.</FormDescription>
                            <FormControl><Input placeholder={briefDescriptionPlaceholder} {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="details.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estimated Value (in ₹)</FormLabel>
                                <FormControl><Input type="text" inputMode="numeric" placeholder="e.g., 500000" {...field} /></FormControl>
                                {formattedValue && (
                                    <FormDescription>
                                        {formattedValue}
                                    </FormDescription>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                    {/* Dynamic Fields */}
                    {renderAssetFields()}
                </div>
            </ScrollArea>
            <DialogFooter className="mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                Cancel
                </Button>
                <Button type="submit">Save Asset</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

