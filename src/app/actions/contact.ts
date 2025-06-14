
"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function submitContactForm(formData: z.infer<typeof contactSchema>): Promise<{ success: boolean; message?: string }> {
  const validatedFields = contactSchema.safeParse(formData);

  if (!validatedFields.success) {
    // Concatenate all error messages for a more informative response
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessages = Object.values(errors).flat().join(" ");
    return {
      success: false,
      message: errorMessages || "Invalid data provided. Please check your input.",
    };
  }

  const { name, email, phone, subject, message } = validatedFields.data;

  // In a real application, you would send an email, save to a CRM, or create a ticket.
  console.log("Contact form submission received:");
  console.log({ name, email, phone, subject, message });

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  // For demonstration purposes, always return success.
  // Add error handling for actual implementation.
  // e.g. if (email.includes("spam")) return { success: false, message: "Could not send message."}

  return { success: true, message: "Thank you for your message! We will get back to you soon." };
}
