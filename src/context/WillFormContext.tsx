'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getWillSection, updateWillSection, getWillListSection, updateWillListItem, addWillListItem, removeWillListItem } from '@/app/actions/will-draft';


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
  saveAndGoTo: (section: keyof Omit<WillFormData, 'willId' | 'version' | 'createdAt'>, currentData: any, path: string) => void;
  setDirty: (isDirty: boolean) => void;
  clearForm: () => void;
  loadWill: (willData: any) => void;
  loading: boolean;
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
  assets: { assets: [] },
  beneficiaries: { beneficiaries: [] },
  assetAllocation: { allocations: [] },
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
                getWillListSection(user.uid, 'assets').then(data => ({ assets: data })),
                getWillListSection(user.uid, 'beneficiaries').then(data => ({ beneficiaries: data })),
                getWillListSection(user.uid, 'assetAllocations').then(data => ({ allocations: data })),
                getWillSection(user.uid, 'executor'),
            ]);

            const loadedData = {
                personalInfo: personalInfo || initialData.personalInfo,
                familyDetails: familyDetails || initialData.familyDetails,
                assets: assets.assets.length > 0 ? assets : initialData.assets,
                beneficiaries: beneficiaries.beneficiaries.length > 0 ? beneficiaries : initialData.beneficiaries,
                assetAllocation: assetAllocation.allocations.length > 0 ? assetAllocation : initialData.assetAllocation,
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


  const saveAndGoTo = async (section: keyof Omit<WillFormData, 'willId' | 'version' | 'createdAt'>, currentData: any, path: string) => {
    
    setFormData(prev => ({...prev, [section]: currentData}));
    setDirty(false);

    if (user) {
        try {
            const listSections: { [key: string]: string } = {
                'assets': 'assets',
                'beneficiaries': 'beneficiaries',
                'assetAllocation': 'allocations'
            };
            
            const collectionName = section === 'assetAllocation' ? 'assetAllocations' : section;

            if (Object.keys(listSections).includes(section)) {
                const items = currentData[listSections[section]];
                const existingItems = await getWillListSection(user.uid, collectionName);
                
                // Simplified approach: clear and re-add.
                await Promise.all(existingItems.map(item => removeWillListItem(collectionName, item.id)));
                await Promise.all(items.map((item: any) => {
                    const { id, ...data } = item;
                    return addWillListItem(user.uid, collectionName, data);
                }));

            } else {
                 await updateWillSection(user.uid, collectionName, currentData);
            }
        } catch (e) {
            console.error("Could not save draft to firestore", e);
             toast({ variant: "destructive", title: "Save Failed", description: "Could not save your progress." });
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

  const clearForm = async () => {
    if (user) {
        const sections = ['personalInfo', 'familyDetails', 'executor'];
        const listSections = ['assets', 'beneficiaries', 'assetAllocations'];

        for(const section of sections) {
            await updateWillSection(user.uid, section, initialData[section as keyof typeof initialData]);
        }
        for(const section of listSections) {
            const items = await getWillListSection(user.uid, section);
            for(const item of items) {
                await removeWillListItem(section, item.id);
            }
        }
    }
    setFormData(initialData);
  };

  return (
    <WillFormContext.Provider value={{ formData, setFormData, saveAndGoTo, setDirty, clearForm, loadWill, loading }}>
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
