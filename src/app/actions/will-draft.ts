
"use server";

import { adminDb } from "@/lib/firebase/admin-config";
import { WillFormData, initialData } from "@/context/WillFormContext";

const draftCollection = adminDb.collection("willDrafts");

// A helper function to deeply merge two objects.
const mergeDeep = (target: any, source: any) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

const isObject = (item: any) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
}


// Get a user's will draft
export async function getWillDraft(userId: string): Promise<WillFormData> {
    try {
        const docRef = draftCollection.doc(userId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const draftData = docSnap.data() as WillFormData;
             // Convert Firestore Timestamps back to JS Dates
            if (draftData.personalInfo?.dob?.toDate) {
                draftData.personalInfo.dob = draftData.personalInfo.dob.toDate();
            }
            if (draftData.createdAt?.toDate) {
                draftData.createdAt = draftData.createdAt.toDate();
            }
            // Deep merge with initialData to ensure all keys are present
            return mergeDeep(initialData, draftData);
        } else {
            // No draft exists, return the initial empty structure
            return initialData;
        }
    } catch (error) {
        console.error("Error getting will draft from Firestore: ", error);
        throw new Error("Could not fetch will draft.");
    }
}


// Create or update a user's will draft
export async function updateWillDraft(userId: string, data: WillFormData): Promise<{ success: boolean; message?: string }> {
    try {
        const docRef = draftCollection.doc(userId);
        await docRef.set(data, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error updating will draft in Firestore: ", error);
        return { success: false, message: "Could not update will draft." };
    }
}

// Delete a user's will draft (e.g., after finalization)
export async function deleteWillDraft(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
        const docRef = draftCollection.doc(userId);
        await docRef.delete();
        return { success: true };
    } catch (error) {
        console.error("Error deleting will draft from Firestore: ", error);
        return { success: false, message: "Could not delete will draft." };
    }
}

    