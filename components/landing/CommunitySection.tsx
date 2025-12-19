"use client";
import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export const CommunitySection = () => {
  return (
    <div id="testimonials" className="h-[40rem] flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-0" />
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-neutral-900 dark:text-white z-10 relative">
          Trusted by Farmers
      </h2>
      <p className="text-center text-neutral-500 mb-12 max-w-2xl px-4 z-10 relative">
          Join a growing community of farmers who are using technology to transform their agriculture.
      </p>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
};

const testimonials = [
  {
    quote:
      "AgroNova helped me save my tomato crop from early blight. The AI detection is incredibly accurate and saved me thousands of rupees!",
    name: "Ramesh Kumar",
    title: "Farmer, Karnataka",
  },
  {
    quote:
      "The market price feature helped me get 20% more for my wheat harvest by selling at the right mandi. Highly recommended.",
    name: "Suresh Singh",
    title: "Farmer, Punjab",
  },
  {
    quote: "Soil analysis used to take weeks. With AgroNova, I get insights instantly so I know exactly what fertilizers to use.",
    name: "Lakshmi Devi",
    title: "Farmer, Andhra Pradesh",
  },
  {
    quote:
      "I love the community feature. Connecting with other farmers and sharing tips has been very helpful.",
    name: "Rajesh Patel",
    title: "Farmer, Gujarat",
  },
  {
    quote:
      "The weather advisories are spot on. I avoided spraying pesticides before a rain thanks to the alert.",
    name: "Anil Yadav",
    title: "Farmer, Uttar Pradesh",
  },
];
