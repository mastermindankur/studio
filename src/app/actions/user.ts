
"use server";

import { adminAuth } from "@/lib/firebase/admin-config";

export async function updateUserProfile(uid: string, data: { displayName?: string, password?: string, phoneNumber?: string }) {
  try {
    const { displayName, phoneNumber } = data;
    await adminAuth.updateUser(uid, {
        displayName,
        phoneNumber,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
