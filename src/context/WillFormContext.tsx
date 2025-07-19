
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the entire form data
interface WillFormData {
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
  clearForm: () => void;
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

const WILL_FORM_STORAGE_KEY = 'willFormData';

export const WillFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<WillFormData>(() => {
    if (typeof window === 'undefined') {
      return initialData;
    }
    try {
      const savedData = window.localStorage.getItem(WILL_FORM_STORAGE_KEY);
      return savedData ? JSON.parse(savedData, (key, value) => {
        // Revive dates properly
        if (key === 'dob' && typeof value === 'string') {
          return new Date(value);
        }
        return value;
      }) : initialData;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialData;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(WILL_FORM_STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [formData]);

  const clearForm = () => {
    setFormData(initialData);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(WILL_FORM_STORAGE_KEY);
    }
  };

  return (
    <WillFormContext.Provider value={{ formData, setFormData, clearForm }}>
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
