
"use server";

import { z } from "zod";
import { adminDb, adminAuth } from "@/lib/firebase/admin-config";
import { FieldValue } from "firebase-admin/firestore";
import { getApps } from "firebase-admin/app";
import { format } from "date-fns";

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
    const userId = formData.userId; 
    if (!userId) {
      return { success: false, message: "User is not authenticated." };
    }

    const { userId: _, ...willData } = formData; 
    
    const willsRef = adminDb.collection("wills");
    
    const userWillsQuery = willsRef.where("userId", "==", userId);
    const userWillsSnapshot = await userWillsQuery.get();
    const newVersion = userWillsSnapshot.size + 1;

    const testatorName = willData.personalInfo?.fullName || "Unknown";
    const willName = `Will of ${testatorName}`;

    const newWillDoc = {
      userId,
      version: newVersion,
      createdAt: FieldValue.serverTimestamp(),
      willName: willName,
      willData: willData,
    };
    
    const docRef = await willsRef.add(newWillDoc);

    return { success: true, message: "Will saved successfully.", willId: docRef.id, version: newVersion };

  } catch (error: any) {
    console.error("Error saving will to Firestore: ", error);
    return { success: false, message: "Could not save will. Please try again later." };
  }
}


export async function updateWill(willId: string, formData: z.infer<typeof willDataSchema>): Promise<{ success: boolean; message?: string; }> {
  try {
    const userId = formData.userId;
    if (!userId) {
      return { success: false, message: "User is not authenticated." };
    }

    const { userId: _, ...willData } = formData; // Remove userId from the data to be saved

    const willRef = adminDb.collection("wills").doc(willId);
    
    // Verify the will belongs to the user before updating
    const doc = await willRef.get();
    if (!doc.exists || doc.data()?.userId !== userId) {
        return { success: false, message: "Will not found or permission denied." };
    }

    // We only update the willData, not createdAt or version number
    await willRef.update({
        'willData': willData,
        'updatedAt': FieldValue.serverTimestamp() // Add an updated timestamp
    });

    return { success: true, message: "Will updated successfully." };

  } catch (error: any) {
    console.error(`Error updating will ${willId}:`, error);
    return { success: false, message: "Could not update will. Please try again later." };
  }
}

export async function getWill(willId: string, userId: string): Promise<any> {
    try {
        const willRef = adminDb.collection('wills').doc(willId);
        const doc = await willRef.get();

        if (!doc.exists) {
            throw new Error('Will not found');
        }

        const data = doc.data();

        if (data?.userId !== userId) {
            throw new Error('Permission denied');
        }

        return { id: doc.id, ...data };
    } catch (error) {
        console.error(`Error getting will ${willId}:`, error);
        throw error;
    }
}
