
"use client";

import { useState, useEffect } from "react";
import { getAuth, updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, KeyRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { updateUserProfile } from "../actions/user";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const { toast } = useToast();
  const auth = getAuth();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhoneNumber(user.phoneNumber || "+91");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmittingProfile(true);
    try {
      // First, update client-side display name for immediate feedback
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      
      // Then, update backend for both name and phone
      const result = await updateUserProfile(user.uid, { displayName, phoneNumber });

      if (result.success) {
        toast({
          title: "Success",
          description: "Your profile has been updated.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    setIsSubmittingPassword(true);

    try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        // Re-authenticate user before changing password
        await reauthenticateWithCredential(user, credential);
        
        // Now update the password
        await updatePassword(user, newPassword);

        toast({
            title: "Success",
            description: "Your password has been changed successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");

    } catch (error: any) {
        let errorMessage = "An error occurred. Please try again.";
        if (error.code === 'auth/wrong-password') {
            errorMessage = "The current password you entered is incorrect.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "The new password is too weak. It must be at least 6 characters long."
        }
        toast({
            variant: "destructive",
            title: "Password Change Failed",
            description: errorMessage,
        });
    } finally {
        setIsSubmittingPassword(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('+91')) {
      setPhoneNumber(value);
    } else if (value.startsWith('+9')) {
      setPhoneNumber('+91');
    } else if (value.startsWith('+')) {
       setPhoneNumber(value);
    }
     else if (value === "") {
      setPhoneNumber("+91");
    } else {
        setPhoneNumber("+91" + value);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p>Please log in to view your profile.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-8">Your Profile</h1>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
             <h2 className="text-xl font-semibold">Account Details</h2>
             <p className="text-muted-foreground mt-1">Manage your account information and password.</p>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your Name"
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Mobile Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="+919876543210"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmittingProfile}>
                    {isSubmittingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <User className="mr-2 h-4 w-4" />}
                    {isSubmittingProfile ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
                
                <Separator className="my-8" />

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <h3 className="font-semibold text-lg">Change Password</h3>
                   <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-sm text-muted-foreground">Must be at least 6 characters long.</p>
                  </div>
                   <Button type="submit" disabled={isSubmittingPassword}>
                    {isSubmittingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                    {isSubmittingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </form>

              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
