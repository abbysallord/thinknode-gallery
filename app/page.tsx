"use client";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 dark:bg-black bg-white">
      <ProjectsCarousel />
    </main>
  );
}
