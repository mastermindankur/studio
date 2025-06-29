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
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
          <p>This Privacy Policy applies to the collection, use, and disclosure of personal information when you use our website and the services provided by iWills.in.</p>
          
          <h2 className="font-headline text-2xl font-semibold text-primary mt-8">Information We Collect and Use</h2>
          <p>We collect personal information from you when you fill out a form or enter information on our site. The types of information we may collect include:</p>
          <ul>
            <li><strong>Personal Information:</strong> such as your name, email address, phone number, and other contact details when you register on our site or fill out a form.</li>
            <li><strong>Usage Data:</strong> information about how you interact with our website, including your IP address, browser type, operating system, and pages visited.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> we use cookies and similar tracking technologies to enhance your experience on our website and for analytics purposes.</li>
          </ul>

          <p>We may use the information we collect from you for the following purposes:</p>
            <ul>
                <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
                <li>To improve our website in order to better serve you.</li>
                <li>To allow us to better service you in responding to your customer service requests.</li>
                <li>To administer a contest, promotion, survey, or other site feature.</li>
                <li>To quickly process your transactions.</li>
                <li>To provide, maintain, and improve our services.</li>
                <li>To communicate with you, including sending promotional materials, newsletters, or updates (with your consent).</li>
                <li>To conduct research and analysis.</li>
                <li>To protect our rights and property.</li>
            </ul>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Data Protection</h2>
          <p>We are committed to protecting the security of your personal information. We implement a variety of security measures when a user enters, submits, or accesses their information to maintain the safety of your personal information.</p>
          <p>However, please note that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee the absolute security of your data.</p>
          
          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Third-Party Services</h2>
          <p>We may use third-party services, such as analytics tools or advertising networks, that collect, monitor, and analyze information to help us improve and promote our services. These third-party service providers have their own privacy policies governing the use of your information.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Children&apos;s Privacy</h2>
          <p>Our website is not intended for children under the age of 13, and we do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately, and we will take steps to remove such information from our records.</p>
          
          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Changes to This Privacy Policy</h2>
          <p>We reserve the right to update or modify this Privacy Policy at any time without prior notice. Any changes will be effective immediately upon posting the revised Privacy Policy on this page.</p>
          <p>We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our website after the posting of changes constitutes your acceptance of such changes.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at hello@iwills.in.</p>

          <p className="mt-8">Last updated: {lastUpdated || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
