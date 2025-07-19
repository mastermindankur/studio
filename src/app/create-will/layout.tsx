
"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WillFormProvider } from "@/context/WillFormContext";
import { SidebarProgress } from "@/components/create-will/sidebar-progress";

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
          <div className="container max-w-screen-xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              <aside className="w-full md:w-1/4 lg:w-1/5">
                <SidebarProgress />
              </aside>
              <div className="flex-1">
                {children}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </WillFormProvider>
  );
}
