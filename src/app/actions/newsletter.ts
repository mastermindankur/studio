
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

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
  const subscriptionsRef = collection(db, "newsletterSubscriptions");

  try {
    // Check if the email is already subscribed
    const q = query(subscriptionsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Don't treat it as an error, just inform the user they are already on the list.
      return { success: true, message: "You're already on our list. Thanks for being a subscriber!" };
    }

    // Add the new email to the collection
    await addDoc(subscriptionsRef, {
      email,
      subscribedAt: serverTimestamp(),
    });
    
    return { success: true, message: "Thank you for subscribing to our newsletter!" };

  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return { success: false, message: "Could not subscribe. Please try again later." };
  }
}
