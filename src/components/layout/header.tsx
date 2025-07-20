
"use client";

import Link from "next/link";
import { Gavel, Menu, X, LogOut, LayoutDashboard, UserPlus, LogIn, HelpCircle, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const navItems = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#services", label: "Our Services" },
  { href: "/about-us", label: "About Us" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#ai-assistant", label: "AI Assistant" },
  { href: "/faqs", label: "FAQs" },
  { href: "/#contact", label: "Contact Us" },
];

const loggedInMobileNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/faqs", label: "FAQs", icon: HelpCircle },
    { href: "/#contact", label: "Contact Us", icon: MessageSquare },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();
  
  const logoHref = user ? "/dashboard" : "/";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
      });
    }
  };
  
  const getUserInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  }

  const AuthLinks = () => {
    if (loading) {
      return <Skeleton className="h-10 w-48" />;
    }
    if (user) {
      return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        {/* AvatarImage can be added here if user has a profile picture */}
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {getUserInitials(user.displayName || user.email)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/login"><LogIn className="mr-2 h-4 w-4" /> Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" /> Sign Up</Link>
        </Button>
      </div>
    );
  };
  
  const MobileAuthLinks = () => {
     if (loading) {
      return <Skeleton className="h-10 w-full mb-2" />;
    }
    if (user) {
      return (
        <>
            <div className="flex items-center gap-4 px-4 py-2">
                <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                       {getUserInitials(user.displayName || user.email)}
                    </AvatarFallback>
                </Avatar>
                <div>
                     <p className="text-base font-medium leading-none">{user.displayName || "User"}</p>
                     <p className="text-sm leading-none text-muted-foreground">{user.email}</p>
                </div>
            </div>
             <div className="mt-2 pt-2 border-t border-border">
                {loggedInMobileNavItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="font-headline text-lg text-foreground hover:text-primary transition-colors duration-300 py-3 text-center flex items-center justify-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-border">
                 <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full">
                    <LogOut className="mr-2 h-5 w-5" /> Logout
                </Button>
            </div>
        </>
      );
    }
    return (
       <div className="mt-auto pt-6 border-t border-border space-y-4">
          <SheetClose asChild>
            <Link href="/login" className="font-headline text-lg text-foreground hover:text-primary transition-colors duration-300 py-2 text-center flex items-center justify-center">
                <LogIn className="mr-2 h-5 w-5" /> Login
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild className="w-full">
                <Link href="/signup"><UserPlus className="mr-2 h-5 w-5" /> Sign Up</Link>
            </Button>
          </SheetClose>
       </div>
    );
  }

  const currentNavItems = user ? [] : navItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 md:gap-10">
            <Link href={logoHref} className="flex items-center space-x-2" aria-label="iWills.in Home">
              <Gavel className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">iWills.in</span>
            </Link>

            {!user && (
              <nav className="hidden lg:flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-headline text-sm text-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
        </div>

        <div className="hidden lg:flex flex-1 justify-end">
          <AuthLinks />
        </div>

        <div className="lg:hidden flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-0 flex flex-col">
                {user ? (
                   <MobileAuthLinks />
                ) : (
                    <>
                        <div className="p-6 flex flex-col space-y-4 flex-grow">
                            <div className="flex justify-between items-center mb-4">
                                <Link href={logoHref} className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)} aria-label="iWills.in Home">
                                    <Gavel className="h-7 w-7 text-primary" />
                                    <span className="font-headline text-xl font-bold text-primary">iWills.in</span>
                                </Link>
                                <SheetClose asChild>
                                    <Button variant="ghost" size="icon" aria-label="Close menu">
                                    <X className="h-6 w-6" />
                                    </Button>
                                </SheetClose>
                            </div>
                            {currentNavItems.map((item) => (
                            <SheetClose asChild key={item.href}>
                                <Link
                                href={item.href}
                                className="font-headline text-lg text-foreground hover:text-primary transition-colors duration-300 py-2 text-center flex items-center justify-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                                >
                                {'icon' in item && <item.icon className="mr-2 h-5 w-5" />}
                                {item.label}
                                </Link>
                            </SheetClose>
                            ))}
                        </div>
                        <div className="p-6">
                            <MobileAuthLinks />
                        </div>
                    </>
                )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
