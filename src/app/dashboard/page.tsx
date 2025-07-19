
"use client";

import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Skeleton className="h-10 w-1/2 mb-8" />
          <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-48" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
     return (
        <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
            <h1 className="font-headline text-3xl font-bold text-primary mb-4">Access Denied</h1>
            <p className="text-lg text-foreground/80 mb-8">Please log in to view your dashboard.</p>
            <Button asChild>
                <Link href="/login">Go to Login</Link>
            </Button>
        </main>
        <Footer />
        </div>
     )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-8">
          Welcome to your Dashboard, {user.displayName || user.email}
        </h1>
        <Card>
            <CardHeader>
                <CardTitle>Your Will</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/80 mb-4">
                    You have not created a Will yet. Get started today to protect your family's future.
                </p>
                <Button asChild>
                    <Link href="/#services">Create Your Will</Link>
                </Button>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
