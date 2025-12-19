"use client";
import React from "react";
import { IconBrandInstagram, IconBrandLinkedin, IconPhone, IconMail } from "@tabler/icons-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
           <span className="text-3xl font-bold text-white tracking-tight">AgroNova</span>
           <p className="mt-6 text-sm leading-relaxed max-w-sm text-neutral-400">
             Empowering farmers with AI-driven intelligence. Join us in revolutionizing Indian agriculture through technology and community.
           </p>
           <div className="mt-8 flex gap-5">
              <a href="https://www.instagram.com/conqueror.core/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                  <IconBrandInstagram size={28} />
              </a>
              <a href="https://www.linkedin.com/in/dhanush-shenoy-h/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  <IconBrandLinkedin size={28} />
              </a>
           </div>
        </div>

        {/* Links */}
        <div>
           <h3 className="text-white font-semibold mb-6">Quick Links</h3>
           <ul className="space-y-4 text-sm">
               <li><Link href="#" className="hover:text-green-500 transition-colors">Home</Link></li>
               <li><Link href="#features" className="hover:text-green-500 transition-colors">Features</Link></li>
               <li><Link href="#about" className="hover:text-green-500 transition-colors">About Us</Link></li>
               <li><Link href="/dashboard" className="hover:text-green-500 transition-colors">Dashboard</Link></li>
           </ul>
        </div>

        {/* Contact */}
        <div>
           <h3 className="text-white font-semibold mb-6">Contact Us</h3>
           <ul className="space-y-4 text-sm">
               <li className="flex items-center gap-3">
                   <div className="p-2 bg-neutral-900 rounded-lg text-green-500">
                       <IconPhone size={18} />
                   </div>
                   <span>+91 63608 69590</span>
               </li>
               <li className="flex items-center gap-3">
                   <div className="p-2 bg-neutral-900 rounded-lg text-green-500">
                       <IconMail size={18} />
                   </div>
                   <a href="mailto:support@agronova.com" className="hover:text-white transition-colors">support@agronova.com</a>
               </li>
           </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
          <p>© 2024 AgroNova. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
      </div>
    </footer>
  );
};
