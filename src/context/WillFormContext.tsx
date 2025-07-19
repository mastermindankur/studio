
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';

// Define the shape of the entire form data
export interface WillFormData {
  willId?: string;
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

const initialData: WillFormData = {
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
    children: [{ name: "" }],
  },
  assets: {
    assets: [{ type: "", description: "", value: "" }],
  },
  beneficiaries: {
    beneficiaries: [{ name: "", relationship: "" }],
  },
  assetAllocation: {
    allocations: [{ assetId: "", beneficiaryId: "", percentage: 100 }],
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
  },
};

const WillFormContext = createContext<WillFormContextType | undefined>(undefined);

const WILL_FORM_STORAGE_KEY_PREFIX = 'willFormData_';

export const WillFormProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDirty, setDirty] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [storageKey, setStorageKey] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setStorageKey(`${WILL_FORM_STORAGE_KEY_PREFIX}${user.uid}`);
    } else {
      setStorageKey(null);
    }
  }, [user]);

  const [formData, setFormData] = useState<WillFormData>(initialData);

  useEffect(() => {
    if (storageKey) {
        if (typeof window === 'undefined') {
          return;
        }
        try {
          const savedData = window.localStorage.getItem(storageKey);
          setFormData(savedData ? JSON.parse(savedData, (key, value) => {
            if (key === 'dob' && typeof value === 'string') {
              return new Date(value);
            }
            return value;
          }) : initialData);
        } catch (error) {
          console.error("Error reading from localStorage", error);
          setFormData(initialData);
        }
    } else {
        setFormData(initialData);
    }
  }, [storageKey]);


  const getStepKey = (path: string): keyof Omit<WillFormData, 'willId'> | null => {
    if (path.includes('personal-information')) return 'personalInfo';
    if (path.includes('family-details')) return 'familyDetails';
    if (path.includes('assets')) return 'assets';
    if (path.includes('beneficiaries')) return 'beneficiaries';
    if (path.includes('asset-allocation')) return 'assetAllocation';
    if (path.includes('executor')) return 'executor';
    return null;
  };

  const saveToLocalStorage = (data: WillFormData) => {
     if (storageKey) {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
     }
  }

  const saveAndGoTo = (currentStepData: any, path: string) => {
    const stepKey = getStepKey(pathname);
    if (stepKey) {
      const updatedData = { ...formData, [stepKey]: currentStepData };
      setFormData(updatedData);
      saveToLocalStorage(updatedData);
    }
    setDirty(false);
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
    const dataToLoad = { ...willData };
    delete dataToLoad.willId;
    setFormData(dataToLoad);
    saveToLocalStorage(dataToLoad);
  };

  const clearForm = () => {
    setFormData(initialData);
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }
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
