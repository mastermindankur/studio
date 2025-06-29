
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

  try {
    await addDoc(collection(db, "contacts"), {
      name,
      email,
      phone,
      subject,
      message,
      submittedAt: serverTimestamp(),
    });
    return { success: true, message: "Thank you for your message! We will get back to you soon." };
  } catch (error) {
    console.error("Error writing contact form to Firestore: ", error);
    return { success: false, message: "Could not send message. Please try again later." };
  }
}
