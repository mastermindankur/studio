
"use server";

import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin-config";
import { FieldValue } from "firebase-admin/firestore";

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
  const subscriptionsRef = adminDb.collection("newsletterSubscriptions");

  try {
    const q = subscriptionsRef.where("email", "==", email);
    const querySnapshot = await q.get();
    if (!querySnapshot.empty) {
      return { success: true, message: "You're already on our list. Thanks for being a subscriber!" };
    }

    await subscriptionsRef.add({
      email,
      subscribedAt: FieldValue.serverTimestamp(),
    });
    
    return { success: true, message: "Thank you for subscribing to our newsletter!" };

  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return { success: false, message: "