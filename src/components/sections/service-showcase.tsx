
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale, Users, Briefcase, FileText, ShieldCheck, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  imageHint: string;
}

const services: Service[] = [
  {
    icon: FileText,
    title: "Wills & Estates",
    description: "Comprehensive planning for your future, ensuring your assets are protected and your wishes are honored.",
    imageHint: "document signature",
  },
  {
    icon: Users,
    title: "Family Law",
    description: "Sensitive and expert guidance through divorce, custody, and other family-related legal matters.",
    imageHint: "family silhouette",
  },
  {
    icon: Briefcase,
    title: "Business Law",
    description: "Strategic legal support for startups and established businesses, from formation to contracts.",
    imageHint: "business meeting",
  },
  {
    icon: Landmark,
    title: "Real Estate Law",
    description: "Navigate property transactions, disputes, and zoning with our experienced legal team.",
    imageHint: "house keys",
  },
  {
    icon: ShieldCheck,
    title: "Litigation & Dispute Resolution",
    description: "Assertive representation in court and effective strategies for resolving conflicts.",
    imageHint: "courtroom gavel",
  },
  {
    icon: Scale,
    title: "Legal Consultation",
    description: "Personalized advice and strategic planning for your specific legal concerns.",
    imageHint: "person thinking",
  },
];

export function ServiceShowcase() {
  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">Our Legal Expertise</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            We offer a wide range of legal services designed to meet the diverse needs of our clients with professionalism and care.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="p-6">
                <div className="mb-4 flex justify-center">
                  <service.icon className="w-12 h-12 text-primary" aria-hidden="true" />
                </div>
                <CardTitle className="font-headline text-2xl text-center text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardDescription className="text-center text-foreground/70 text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
