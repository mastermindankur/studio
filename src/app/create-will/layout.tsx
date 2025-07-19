
"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WillFormProvider } from "@/context/WillFormContext";
import { ProgressIndicator } from "@/components/create-will/progress-indicator";

export default function CreateWillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WillFormProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-primary/5">
          <div className="container max-w-6xl mx-auto px-4 py-12">
            <ProgressIndicator />
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </WillFormProvider>
  );
}
