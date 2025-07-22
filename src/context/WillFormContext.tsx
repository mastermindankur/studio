
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getWillSection, updateWillSection as updateWillSectionAction, getWillListSection, addWillListItem, updateWillListItem, removeWillListItem } from '@/app/actions/will-draft';
import { type Asset } from '@/lib/schemas/asset-schema';
import { type Beneficiary } from '@/lib/schemas/beneficiary-schema';


// Define the shape of the entire form data
export interface WillFormData {
  willId?: string;
  version?: number;
  createdAt?: Date;
  personalInfo: any;
  familyDetails: any;
  assets: { assets: Asset[] };
  beneficiaries: { beneficiaries: Beneficiary[] };
  assetAllocation: any;
  executor: any;
}

// Define the context type
interface WillFormContextType {
  formData: WillFormData;
  setFormData: React.Dispatch<React.SetStateAction<WillFormData>>;
  setDirty: (isDirty: boolean) => void;
  clearForm: () => void;
  loadWill: (willData: any) => void;
  loading: boolean;
  addAsset: (asset: Asset) => Promise<string | undefined>;
  updateAsset: (asset: Asset) => Promise<void>;
  removeAsset: (assetId: string) => Promise<void>;
  addBeneficiary: (beneficiary: Beneficiary) => Promise<string | undefined>;
  updateBeneficiary: (beneficiary: Beneficiary) => Promise<void>;
  removeBeneficiary: (beneficiaryId: string) => Promise<void>;
  updateAllocations: (allocations: any[]) => Promise<void>;
  updateWillSection: (section: keyof Omit<WillFormData, 'willId' | 'version' | 'createdAt' | 'assets' | 'beneficiaries'>, data: any) => Promise<void>;
}

export const initialData: WillFormData = {
  personalInfo: {
    fullName: "",
    fatherHusbandName: "",
    aadhar: "",
    occupation: "",
    address: "",
    email: "",
    mobile: "",
  },
  familyDetails: {
    children: [],
  },
  assets: {
    assets: [],
  },
  beneficiaries: {
    beneficiaries: [],
  },
  assetAllocation: {
    allocations: [],
  },
  executor: {
    primaryExecutor: {
      fullName: "",
      fatherName: "",
      aadhar: "",
      address: "",
      email: "",
      mobile: "",
    },
    addSecondExecutor: false,
    secondExecutor: {
        fullName: "",
        fatherName: "",
        aadhar: "",
        address: "",
        email: "",
        mobile: "",
    },
    city: "",
    state: "",
  },
};


const WillFormContext = createContext<WillFormContextType | undefined>(undefined);

// A helper function to deeply merge two objects.
const mergeDeep = (target: any, source: any) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

const isObject = (item: any) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
}


export const WillFormProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isDirty, setDirty] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<WillFormData>(initialData);
  
  useEffect(() => {
    const loadDraftData = async () => {
      if (user) {
        setLoading(true);
        try {
            const [
                personalInfo,
                familyDetails,
                assets,
                beneficiaries,
                assetAllocation,
                executor
            ] = await Promise.all([
                getWillSection(user.uid, 'personalInfo'),
                getWillSection(user.uid, 'familyDetails'),
                getWillListSection(user.uid, 'assets'),
                getWillListSection(user.uid, 'beneficiaries'),
                getWillSection(user.uid, 'assetAllocation'), // assetAllocation is not a list
                getWillSection(user.uid, 'executor'),
            ]);

            const loadedData = {
                ...initialData,
                personalInfo: personalInfo || initialData.personalInfo,
                familyDetails: familyDetails || initialData.familyDetails,
                assets: { assets: assets.length > 0 ? assets : initialData.assets.assets },
                beneficiaries: { beneficiaries: beneficiaries.length > 0 ? beneficiaries : initialData.beneficiaries.beneficiaries },
                assetAllocation: assetAllocation || initialData.assetAllocation,
                executor: executor || initialData.executor,
            };
            setFormData(loadedData);

        } catch (error) {
          console.error("Failed to load draft data:", error);
          setFormData(initialData);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
        setFormData(initialData);
      }
    };
    loadDraftData();
  }, [user, authLoading]);

  const updateWillSection = async (section: keyof Omit<WillFormData, 'willId' | 'version' | 'createdAt' | 'assets' | 'beneficiaries'>, data: any): Promise<void> => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to save." });
      return;
    }
    try {
      await updateWillSectionAction(user.uid, section, data);
      setFormData(prev => ({ ...prev, [section]: data }));
      toast({
        title: "Progress Saved",
        description: `Your ${section} information has been successfully saved.`,
      });
    } catch (e) {
      console.error(`Could not save ${section} to firestore`, e);
      toast({ variant: "destructive", title: "Save Failed", description: `Could not save your ${section} progress.` });
    }
  };


  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const loadWill = (willData: any) => {
    const dataToLoad = mergeDeep(initialData, willData);
    setFormData(dataToLoad);
  };

  const clearForm = async () => {
    // This function now only clears the state in the browser,
    // it does NOT delete any data from Firestore.
    setFormData(initialData);
  };

  const addAsset = async (asset: Asset): Promise<string | undefined> => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to add an asset." });
      return;
    }
    const { id, index, ...assetData } = asset;
    const result = await addWillListItem(user.uid, 'assets', assetData);
    if (result.success && result.id) {
      toast({ title: "Asset Added", description: "Your asset has been saved successfully." });
      setFormData(prev => ({
          ...prev,
          assets: {
              assets: [...prev.assets.assets, { ...asset, id: result.id! }]
          }
      }));
      return result.id;
    } else {
      toast({ variant: "destructive", title: "Save Failed", description: result.message || "Could not save the asset." });
    }
  };

  const updateAsset = async (asset: Asset): Promise<void> => {
    if (!user || !asset.id) {
      toast({ variant: "destructive", title: "Error", description: "Cannot update asset without an ID." });
      return;
    }
    const { id, index, ...assetData } = asset;
    const result = await updateWillListItem('assets', id, assetData);
    if (result.success) {
      toast({ title: "Asset Updated", description: "Your asset has been updated successfully." });
      setFormData(prev => ({
          ...prev,
          assets: {
              assets: prev.assets.assets.map(a => a.id === id ? { ...a, ...assetData } : a)
          }
      }));
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: result.message || "Could not update the asset." });
    }
  };

  const removeAsset = async (assetId: string): Promise<void> => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to remove an asset." });
      return;
    }
    const result = await removeWillListItem('assets', assetId);
    if (result.success) {
      toast({ title: "Asset Removed", description: "The asset has been removed." });
       setFormData(prev => ({
          ...prev,
          assets: {
              assets: prev.assets.assets.filter(a => a.id !== assetId)
          }
      }));
    } else {
      toast({ variant: "destructive", title: "Removal Failed", description: result.message || "Could not remove the asset." });
    }
  };

  const addBeneficiary = async (beneficiary: Beneficiary): Promise<string | undefined> => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to add a beneficiary." });
      return;
    }
    const { id, index, ...beneficiaryData } = beneficiary;
    const result = await addWillListItem(user.uid, 'beneficiaries', beneficiaryData);
    if (result.success && result.id) {
      toast({ title: "Beneficiary Added", description: "The beneficiary has been saved." });
      setFormData(prev => ({
        ...prev,
        beneficiaries: {
          beneficiaries: [...prev.beneficiaries.beneficiaries, { ...beneficiary, id: result.id! }]
        }
      }));
      return result.id;
    } else {
      toast({ variant: "destructive", title: "Save Failed", description: result.message || "Could not save the beneficiary." });
    }
  };
  
  const updateBeneficiary = async (beneficiary: Beneficiary): Promise<void> => {
    if (!user || !beneficiary.id) {
      toast({ variant: "destructive", title: "Error", description: "Cannot update beneficiary without an ID." });
      return;
    }
    const { id, index, ...beneficiaryData } = beneficiary;
    const result = await updateWillListItem('beneficiaries', id, beneficiaryData);
    if (result.success) {
      toast({ title: "Beneficiary Updated", description: "The beneficiary has been updated." });
      setFormData(prev => ({
        ...prev,
        beneficiaries: {
          beneficiaries: prev.beneficiaries.beneficiaries.map(b => b.id === id ? { ...b, ...beneficiaryData } : b)
        }
      }));
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: result.message || "Could not update beneficiary." });
    }
  };
  
  const removeBeneficiary = async (beneficiaryId: string): Promise<void> => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to remove a beneficiary." });
      return;
    }
    const result = await removeWillListItem('beneficiaries', beneficiaryId);
    if (result.success) {
      toast({ title: "Beneficiary Removed", description: "The beneficiary has been removed." });
      setFormData(prev => ({
        ...prev,
        beneficiaries: {
          beneficiaries: prev.beneficiaries.beneficiaries.filter(b => b.id !== beneficiaryId)
        }
      }));
    } else {
      toast({ variant: "destructive", title: "Removal Failed", description: result.message || "Could not remove beneficiary." });
    }
  };

  const updateAllocations = async (allocations: any[]): Promise<void> => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to save allocations." });
      return;
    }
    const allocationData = { allocations };
    const result = await updateWillSectionAction(user.uid, 'assetAllocation', allocationData);
    if (result.success) {
      toast({ title: "Allocations Saved", description: "Your allocations have been saved successfully." });
      setFormData(prev => ({
        ...prev,
        assetAllocation: allocationData,
      }));
    } else {
      toast({ variant: "destructive", title: "Save Failed", description: result.message || "Could not save your allocations." });
    }
  }


  return (
    <WillFormContext.Provider value={{ formData, setFormData, setDirty, clearForm, loadWill, loading, addAsset, updateAsset, removeAsset, addBeneficiary, updateBeneficiary, removeBeneficiary, updateAllocations, updateWillSection }}>
      {children}
    </WillFormContext.Provider>
  );
};

export const useWillForm = () => {
  const context = useContext(WillFormContext);
  if (context === undefined) {
    throw new Error('useWillForm must be used within a WillFormProvider');
  }
  return context;
};

    
    