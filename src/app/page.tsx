
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { ServiceShowcase } from "@/components/sections/service-showcase";
import { Testimonials } from "@/components/sections/testimonials";
import { AIAssistant } from "@/components/sections/ai-assistant";
import { ContactForm } from "@/components/sections/contact-form";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ServiceShowcase />
        <Testimonials />
        <AIAssistant />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
