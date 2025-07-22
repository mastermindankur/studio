
import * as z from "zod";

export const assetTypes = [
  "Bank Account",
  "Real Estate",
  "Vehicle",
  "Stocks/Investments",
  "Insurance Policy",
  "Jewelry/Valuables",
  "Other",
] as const;

export const bankAccountTypes = ["Savings", "Current", "Fixed Deposit (FD)", "Recurring Deposit (RD)"] as const;
export const propertyTypes = ["Flat/Apartment", "Independent House", "Agricultural Land", "Non-Agricultural Land", "Commercial Property"] as const;
export const vehicleTypes = ["Car", "Motorcycle", "Scooter", "Other"] as const;

// Base schema for common details
const baseDetailsSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters."),
  value: z.string().regex(/^\d+$/, { message: "Value must be a number." }).optional().or(z.literal('')),
});

// Schemas for each asset type's specific details
const bankAccountSchema = baseDetailsSchema.extend({
  bankName: z.string().min(2, "Bank name is required."),
  accountType: z.enum(bankAccountTypes),
  accountNumber: z.string().min(4, "Account number is required."),
  branchAddress: z.string().optional(),
});

const realEstateSchema = baseDetailsSchema.extend({
  propertyType: z.enum(propertyTypes),
  propertyAddress: z.string().min(10, "Property address is required."),
  surveyNumber: z.string().optional(),
  area: z.string().optional(),
});

const vehicleSchema = baseDetailsSchema.extend({
  vehicleType: z.enum(vehicleTypes),
  makeModel: z.string().min(2, "Make and model are required."),
  registrationNumber: z.string().min(4, "Registration number is required."),
  chassisNumber: z.string().optional(),
});

const investmentSchema = baseDetailsSchema.extend({
  brokerName: z.string().min(2, "Broker/Firm name is required."),
  dematAccountNumber: z.string().optional(),
  sharesDescription: z.string().min(5, "Description of holdings is required."),
});

const insuranceSchema = baseDetailsSchema.extend({
  insurer: z.string().min(2, "Insurance company name is required."),
  policyNumber: z.string().min(4, "Policy number is required."),
  sumAssured: z.string().regex(/^\d+$/, { message: "Sum assured must be a number." }),
  nomineeName: z.string().optional(),
});

const valuablesSchema = baseDetailsSchema.extend({
  itemName: z.string().min(2, "Item name is required."),
  identifyingMarks: z.string().min(10, "Please provide a detailed description."),
});

const otherSchema = baseDetailsSchema.extend({
  otherType: z.string().min(2, "Asset type is required."),
  otherDetails: z.string().min(10, "Please provide details."),
});


// A discriminated union to enforce type-specific details
export const assetSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("Bank Account"), details: bankAccountSchema }),
  z.object({ type: z.literal("Real Estate"), details: realEstateSchema }),
  z.object({ type: z.literal("Vehicle"), details: vehicleSchema }),
  z.object({ type: z.literal("Stocks/Investments"), details: investmentSchema }),
  z.object({ type: z.literal("Insurance Policy"), details: insuranceSchema }),
  z.object({ type: z.literal("Jewelry/Valuables"), details: valuablesSchema }),
  z.object({ type: z.literal("Other"), details: otherSchema }),
]).and(z.object({
    id: z.string().optional(),
    index: z.number().optional(), // Used for tracking position in form array
}));

// This helper schema adds optional fields to all detail types for the form
// This prevents errors in react-hook-form when switching between asset types
const formHelperDetailsSchema = z.object({
    description: z.string().optional(),
    value: z.string().optional(),
    bankName: z.string().optional(),
    accountType: z.enum(bankAccountTypes).optional(),
    accountNumber: z.string().optional(),
    branchAddress: z.string().optional(),
    propertyType: z.enum(propertyTypes).optional(),
    propertyAddress: z.string().optional(),
    surveyNumber: z.string().optional(),
    area: z.string().optional(),
    vehicleType: z.enum(vehicleTypes).optional(),
    makeModel: z.string().optional(),
    registrationNumber: z.string().optional(),
    chassisNumber: z.string().optional(),
    brokerName: z.string().optional(),
    dematAccountNumber: z.string().optional(),
    sharesDescription: z.string().optional(),
    insurer: z.string().optional(),
    policyNumber: z.string().optional(),
    sumAssured: z.string().optional(),
    nomineeName: z.string().optional(),
    itemName: z.string().optional(),
    identifyingMarks: z.string().optional(),
    otherType: z.string().optional(),
    otherDetails: z.string().optional(),
});


export const assetFormSchema = z.object({
  id: z.string().optional(),
  type: z.enum(assetTypes),
  details: formHelperDetailsSchema,
});


export type Asset = z.infer<typeof assetFormSchema>;
