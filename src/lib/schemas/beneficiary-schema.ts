
import * as z from "zod";

export const beneficiaryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  relationship: z.string().min(2, "Relationship is required."),
  index: z.number().optional(), // Used for tracking position in form array
});

export type Beneficiary = z.infer<typeof beneficiaryFormSchema>;
