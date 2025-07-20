
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ServiceShowcase } from "@/components/sections/service-showcase";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { AIAssistant } from "@/components/sections/ai-assistant";
import { ContactForm } from "@/components/sections/contact-form";

const SectionSeparator = () => (
  <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="w-full h-[1px] bg-border" />
  </div>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <SectionSeparator />
        <ServiceShowcase />
        <SectionSeparator />
        <Pricing />
        <SectionSeparator />
        <AIAssistant />
        <SectionSeparator />
        <Testimonials />
        <SectionSeparator />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
