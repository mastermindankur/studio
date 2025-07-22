
"use server";

import { adminDb } from "@/lib/firebase/admin-config";

// Get a section of a user's will draft
export async function getWillSection(userId: string, section: string): Promise<any> {
    try {
        const docRef = adminDb.collection(section).doc(userId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            // Convert Firestore Timestamps back to JS Dates if necessary
            if (data && data.dob && data.dob.toDate) {
                data.dob = data.dob.toDate();
            }
            if (data && data.createdAt && data.createdAt.toDate) {
                data.createdAt = data.createdAt.toDate();
            }
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error getting ${section} for user ${userId} from Firestore: `, error);
        throw new Error(`Could not fetch ${section}.`);
    }
}


// Create or update a section of a user's will draft
export async function updateWillSection(userId: string, section: string, data: any): Promise<{ success: boolean; message?: string }> {
    try {
        const docRef = adminDb.collection(section).doc(userId);
        await docRef.set(data, { merge: true });
        return { success: true };
    } catch (error) {
        console.error(`Error updating ${section} for user ${userId} in Firestore: `, error);
        return { success: false, message: `Could not update ${section}.` };
    }
}

// Get a list-based section of a user's will (e.g., assets, beneficiaries)
export async function getWillListSection(userId: string, section: string): Promise<any[]> {
    try {
        const collectionRef = adminDb.collection(section).where('userId', '==', userId);
        const snapshot = await collectionRef.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error getting list section ${section} for user ${userId} from Firestore: `, error);
        throw new Error(`Could not fetch ${section}.`);
    }
}

export async function addWillListItem(userId: string, section: string, itemData: any): Promise<{ success: boolean, id?: string, message?: string }> {
    try {
        const collectionRef = adminDb.collection(section);
        const docRef = await collectionRef.add({ ...itemData, userId });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error(`Error adding item to ${section} for user ${userId}:`, error);
        return { success: false, message: `Could not add item to ${section}.` };
    }
}

export async function updateWillListItem(section: string, itemId: string, itemData: any): Promise<{ success: boolean, message?: string }> {
    try {
        const docRef = adminDb.collection(section).doc(itemId);
        await docRef.update(itemData);
        return { success: true };
    } catch (error) {
        console.error(`Error updating item ${itemId} in ${section}:`, error);
        return { success: false, message: `Could not update item in ${section}.` };
    }
}

export async function removeWillListItem(section: string, itemId: string): Promise<{ success: boolean, message?: string }> {
    try {
        const docRef = adminDb.collection(section).doc(itemId);
        await docRef.delete();
        return { success: true };
    } catch (error) {
        console.error(`Error removing item ${itemId} from ${section}:`, error);
        return { success: false, message: `Could not remove item from ${section}.` };
    }
}
