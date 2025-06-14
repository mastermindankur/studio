"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from 'react';


export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Privacy Policy for iWills.in</h1>
        <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
          <p>Welcome to iWills.in&apos;s Privacy Policy. Your privacy is critically important to us as you use our online Will creation services for India.</p>
          
          <h2 className="font-headline text-2xl font-semibold text-primary mt-8">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when you use our services, such as when you register an account, create a Will, fill out a contact form, or interact with our AI Will Assistant. This may include:</p>
          <ul>
            <li>Personal identification information (Name, email address, phone number, AADHAAR details (if voluntarily provided for specific services), etc.)</li>
            <li>Information related to your Will, beneficiaries, assets, and executors, specifically for the purpose of Will creation under Indian law.</li>
            <li>Usage data related to your interaction with our website and AI tools.</li>
          </ul>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain our Will creation services tailored for India.</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Understand and analyze how you use our services.</li>
            <li>Communicate with you, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes (with your consent).</li>
            <li>Process your Will creation and related inquiries.</li>
            <li>Comply with Indian legal obligations and prevent fraud.</li>
          </ul>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">3. Sharing Your Information</h2>
          <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice or as required by Indian law. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential and comply with applicable data protection laws in India. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others&apos; rights, property or safety.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">4. Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential.</p>
          
          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">5. Your Data Protection Rights</h2>
          <p>As per Indian law, you may have certain rights regarding your personal data, including the right to access, correct, or delete your data. Please contact us to exercise these rights.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">6. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at contact@iwills.in.</p>

          <p className="mt-8"><em>This is a placeholder privacy policy. iWills.in strongly advises consulting with a legal professional to create a policy appropriate for your specific services and jurisdiction within India.</em></p>
          <p>Last updated: {lastUpdated || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
