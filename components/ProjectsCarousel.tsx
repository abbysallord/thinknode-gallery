"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { projects } from "@/app/data/projects";
import Image from "next/image";

export function ProjectsCarousel() {
  const cards = projects.map((project, index) => (
    <Card key={project.src} card={itemToCard(project)} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Our Showcase
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const itemToCard = (project: any) => {
  return {
    category: "Project",
    title: project.title,
    src: project.thumbnail,
    content: <ProjectContent project={project} />,
  };
};

const ProjectContent = ({ project }: { project: any }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          {project.title}
        </span>{" "}
        is one of our cherished projects. Click below to visit the live site.
      </p>
      <div className="flex justify-center mt-8">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:opacity-80 transition-opacity"
        >
          Visit Website
        </a>
      </div>
      <Image
        src={project.thumbnail}
        alt={project.title}
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-10"
      />
    </div>
  );
};
