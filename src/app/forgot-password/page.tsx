
"use client";

import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Gavel, Loader2, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const auth = getAuth(app);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Sending Email",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-background">
          <Card className="w-full max-w-md mx-4 text-center">
            <CardHeader>
               <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
               </div>
               <CardTitle className="font-headline text-2xl">Email Sent!</CardTitle>
               <CardDescription>A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
                <Button asChild>
                    <Link href="/login">Return to Login</Link>
                </Button>
            </CardFooter>
          </Card>
       </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-4" aria-label="iWills.in Home">
              <Gavel className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">iWills.in</span>
            </Link>
          <CardTitle className="font-headline text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
