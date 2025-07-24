
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const teamMembers = [
  {
    name: "Aarav Sharma",
    role: "Founder & CEO",
    bio: "With a passion for leveraging technology to solve real-world problems, Aarav founded iWills.in to make legacy planning accessible and stress-free for all Indians.",
    avatarSrc: "/images/team-aarav-sharma.jpg",
    avatarFallback: "AS",
    imageHint: "man portrait professional",
  },
  {
    name: "Sneha Gupta",
    role: "Head of Legal & Compliance",
    bio: "Sneha is a seasoned lawyer specializing in Indian succession law. She ensures that every will generated on our platform is legally robust and compliant.",
    avatarSrc: "/images/team-sneha-gupta.jpg",
    avatarFallback: "SG",
    imageHint: "woman portrait professional",
  },
  {
    name: "Vikram Singh",
    role: "Lead Software Engineer",
    bio: "Vikram leads our talented tech team, focusing on building a secure, reliable, and user-friendly platform. He is the architect behind our seamless will-creation process.",
    avatarSrc: "/images/team-vikram-singh.jpg",
    avatarFallback: "VS",
    imageHint: "man portrait technology",
  },
];

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">About iWills.in</h1>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Demystifying the process of Will creation and empowering every Indian to secure their legacy with confidence and ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="rounded-lg overflow-hidden shadow-xl aspect-square">
                <Image
                src="/images/about-us-mission.jpg"
                alt="Our mission at iWills.in"
                width={600}
                height={600}
                className="object-cover w-full h-full"
                data-ai-hint="team collaboration office"
                priority
                />
            </div>
            <div>
                <h2 className="font-headline text-3xl font-semibold text-primary mb-4">Our Mission</h2>
                <p className="text-foreground/80 mb-4 leading-relaxed">
                Our mission is to make the process of creating a legally-sound Will simple, accessible, and affordable for every individual in India. We believe that legacy planning is a fundamental right, not a complex privilege. By combining legal expertise with intuitive technology, we aim to remove the barriers of fear, cost, and complexity that prevent people from protecting their family's future.
                </p>
                <h2 className="font-headline text-3xl font-semibold text-primary mb-4 mt-6">Our Vision</h2>
                <p className="text-foreground/80 leading-relaxed">
                We envision a future where every Indian can create and manage their Will with confidence and peace of mind. We strive to be the most trusted digital platform for succession planning in India, known for our commitment to security, legal accuracy, and exceptional customer support.
                </p>
            </div>
        </div>

        <div className="text-center mb-12 mt-24">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">Meet the Team</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            We are a dedicated team of legal experts and technologists passionate about making a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center bg-card hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-primary/50">
                  <AvatarImage asChild src={member.avatarSrc} alt={member.name}>
                    <Image src={member.avatarSrc} alt={member.name} width={128} height={128} data-ai-hint={member.imageHint} />
                  </AvatarImage>
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">{member.avatarFallback}</AvatarFallback>
                </Avatar>
                <h3 className="font-headline text-xl font-bold text-primary">{member.name}</h3>
                <p className="text-sm text-accent font-semibold mb-3">{member.role}</p>
                <p className="text-foreground/70 text-sm">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
