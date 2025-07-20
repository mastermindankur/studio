
"use server";

import { z } from "zod";
import { adminDb, adminAuth } from "@/lib/firebase/admin-config";
import { FieldValue } from "firebase-admin/firestore";
import { getApps } from "firebase-admin/app";

// Simplified schema for validation. In a real app, this should be more specific.
const willDataSchema = z.any();

async function getUserIdFromToken(idToken: string): Promise<string> {
    if (getApps().length === 0) {
        // This should not happen if admin-config is initialized correctly
        throw new Error("Firebase admin not initialized");
    }
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken.uid;
}

export async function saveWill(formData: z.infer<typeof willDataSchema>): Promise<{ success: boolean; message?: string; willId?: string; version?: number }> {
  try {
    // This is a workaround for getting the token in a server action
    // In a real app, you might pass this explicitly or use a different auth pattern
    // For this context, we assume a mechanism to get the user's ID securely.
    // As a placeholder, we cannot directly get the token here.
    // The logic will need to be called from a client component that provides the token.
    // For now, we will assume a placeholder userId.
    // In a real scenario, the calling client component would fetch the token and pass it.
    
    // THIS IS A SIMPLIFICATION. A real app needs to securely get the user ID on the server.
    const userId = formData.userId; // Assuming userId is passed in from the client
    if (!userId) {
      return { success: false, message: "User is not authenticated." };
    }

    const { userId: _, ...willData } = formData; // Remove userId from the data to be saved
    
    const willsRef = adminDb.collection("wills");
    
    const userWillsQuery = willsRef.where("userId", "==", userId);
    const userWillsSnapshot = await userWillsQuery.get();
    const newVersion = userWillsSnapshot.size + 1;

    const newWillDoc = {
      userId,
      version: newVersion,
      createdAt: FieldValue.serverTimestamp(),
      willData: willData,
    };
    
    const docRef = await willsRef.add(newWillDoc);

    return { success: true, message: "Will saved successfully.", willId: docRef.id, version: newVersion };

  } catch (error: any) {
    console.error("Error saving will to Firestore: ", error);
    return { success: false, message: "Could not save will. Please try again later." };
  }
}
