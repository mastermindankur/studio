
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { updateWill } from '@/app/actions/will';
import { useToast } from '@/hooks/use-toast';
import { updateWillDraft } from '@/app/actions/will-draft';


// Define the shape of the entire form data
export interface WillFormData {
  willId?: string;
  version?: number;
  createdAt?: Date;
  personalInfo: any;
  familyDetails: any;
  assets: any;
  beneficiaries: any;
  assetAllocation: any;
  executor: any;
}

// Define the context type
interface WillFormContextType {
  formData: WillFormData;
  setFormData: React.Dispatch<React.SetStateAction<WillFormData>>;
  saveAndGoTo: (currentData: any, path: string) => void;
  setDirty: (isDirty: boolean) => void;
  clearForm: () => void;
  loadWill: (willData: any) => void;
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
  const pathname = usePathname();
  const [isDirty, setDirty] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<WillFormData>(initialData);

  const getStepKey = (path: string): keyof Omit<WillFormData, 'willId' | 'version' | 'createdAt'> | null => {
    if (path.includes('personal-information')) return 'personalInfo';
    if (path.includes('family-details')) return 'familyDetails';
    if (path.includes('assets')) return 'assets';
    if (path.includes('beneficiaries')) return 'beneficiaries';
    if (path.includes('asset-allocation')) return 'assetAllocation';
    if (path.includes('executor')) return 'executor';
    return null;
  };

  const saveAndGoTo = async (currentStepData: any, path: string) => {
    const stepKey = getStepKey(pathname);
    let updatedData = { ...formData };
    if (stepKey) {
      updatedData = { ...formData, [stepKey]: currentStepData };
    }
    
    setFormData(updatedData);
    setDirty(false);

    if (user) {
        try {
             await updateWillDraft(user.uid, updatedData);
        } catch (e) {
            console.error("Could not save draft to firestore", e);
             toast({ variant: "destructive", title: "Save Failed", description: "Could not save your progress." });
        }
    }

    // If exiting to dashboard while editing an existing will, update it in Firestore.
    if (path === '/dashboard' && updatedData.willId && user) {
        const result = await updateWill(updatedData.willId, { ...updatedData, userId: user.uid });
        if (result.success) {
            toast({ title: "Will Updated", description: "Your changes have been saved." });
        } else {
            toast({ variant: "destructive", title: "Update Failed", description: result.message });
        }
    }

    router.push(path);
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
    // Deep merge existing will data with the initial structure to ensure all keys are present
    const dataToLoad = mergeDeep(initialData, willData);
    setFormData(dataToLoad);
  };

  const clearForm = () => {
    setFormData(initialData);
  };

  return (
    <WillFormContext.Provider value={{ formData, setFormData, saveAndGoTo, setDirty, clearForm, loadWill }}>
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
