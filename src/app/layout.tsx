import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'iWills.in - Online Will Creation for India',
  description: 'Easily create legally sound Wills online, compliant with Indian law. Secure your legacy with iWills.in.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
