
"use server";

import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function subscribeToNewsletter(formData: { email: string }): Promise<{ success: boolean; message?: string }> {
  const validatedFields = newsletterSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid email address provided.",
    };
  }

  const { email } = validatedFields.data;

  // In a real application, you would save the email to a database or marketing service.
  console.log(`Newsletter subscription attempt for: ${email}`);

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For demonstration, always return success.
  // Add error handling for actual implementation.
  if (email.includes("fail")) { // Simulate a failure case
     return { success: false, message: "This email address is blocked." };
  }

  return { success: true, message: "Thank you for subscribing to our newsletter!" };
}
