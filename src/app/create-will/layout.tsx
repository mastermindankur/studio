
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WillFormProvider } from "@/context/WillFormContext";

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
          {children}
        </main>
        <Footer />
      </div>
    </WillFormProvider>
  );
}
