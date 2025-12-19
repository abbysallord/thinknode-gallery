"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-800 dark:from-green-400 dark:to-emerald-600">
              AgroNova
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#testimonials">Community</NavLink>
              <NavLink href="#about">About Us</NavLink>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-4">
                 <Link href="/login">
                    <button className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-medium transition-colors">
                        Login
                    </button>
                 </Link>
                 <Link href="/signup">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-green-500/20">
                        Get Started
                    </button>
                 </Link>
                 <ThemeToggle />
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink href="#features">Features</MobileNavLink>
              <MobileNavLink href="#testimonials">Community</MobileNavLink>
              <MobileNavLink href="#about">About Us</MobileNavLink>
               <div className="pt-4 flex flex-col gap-2">
                 <Link href="/login" className="w-full">
                    <button className="w-full text-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-medium py-2 transition-colors">
                        Login
                    </button>
                 </Link>
                 <Link href="/signup" className="w-full">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                        Get Started
                    </button>
                 </Link>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-neutral-600 hover:text-green-600 dark:text-neutral-300 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 block px-3 py-2 rounded-md text-base font-medium"
  >
    {children}
  </Link>
);
