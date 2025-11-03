
"use client";

import { useState } from "react";
import { StarsBackground } from "@/components/stars-background";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Search, X } from "lucide-react";
import placeholderImages from "@/lib/placeholder-images.json";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const coursesSection = document.getElementById("courses-section");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectedCourse = selectedId
    ? placeholderImages.courses.find((c) => c.title === selectedId)
    : null;

  return (
    <div className="bg-gradient-to-tr from-[#000000] via-[#0c0c2c] to-[#1a0f35] text-white">
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
        <StarsBackground />
        <div className="z-10 flex flex-col items-center text-center">
          <h1
            className="animate-fade-in-up text-4xl sm:text-5xl font-bold text-white md:text-7xl"
            style={{ animationDelay: "0.2s" }}
          >
            NextVerseEducation
          </h1>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div
              className="animate-fade-in-up transition-transform duration-300 ease-in-out active:scale-95"
              style={{ animationDelay: "0.6s" }}
            >
              <Link href="/login">
                <ShimmerButton>Get Started</ShimmerButton>
              </Link>
            </div>
            <div
              className="animate-fade-in-up transition-transform duration-300 ease-in-out active:scale-95"
              style={{ animationDelay: "0.8s" }}
            >
              <ShimmerButton onClick={handleScroll}>Explore</ShimmerButton>
            </div>
          </div>
        </div>
      </main>

      <section id="courses-section" className="py-20 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="mb-12 flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Explore Our Courses</h2>
            <div className="relative w-full max-w-lg">
              <Input
                type="search"
                placeholder="Search for courses..."
                className="w-full rounded-full bg-white/10 py-5 px-6 md:py-6 pl-12 text-base md:text-lg text-white placeholder:text-gray-300"
              />
              <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {placeholderImages.courses.map((course) => (
              <motion.div
                key={course.title}
                layoutId={`card-container-${course.title}`}
                onClick={() => setSelectedId(course.title)}
                className="cursor-pointer"
              >
                <Card
                  className="flex h-full transform flex-col overflow-hidden rounded-lg border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <CardHeader className="p-0">
                    <motion.div layoutId={`card-image-${course.title}`}>
                      <Image
                        src={course.src}
                        alt={course.alt}
                        width={600}
                        height={400}
                        className="h-48 w-full object-cover"
                        data-ai-hint={course.hint}
                      />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="flex-grow p-6">
                    <motion.h2 layoutId={`card-title-${course.title}`} className="mb-2 text-xl font-bold text-white">
                      {course.title}
                    </motion.h2>
                    <motion.p layoutId={`card-description-${course.title}`} className="text-white/80">
                      {course.description}
                    </motion.p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            layoutId={`card-container-${selectedCourse.title}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4"
          >
            <Card className="w-full max-w-3xl overflow-hidden rounded-lg border-white/20 bg-white/10">
              <CardHeader className="p-0">
                <motion.div layoutId={`card-image-${selectedCourse.title}`}>
                  <Image
                    src={selectedCourse.src}
                    alt={selectedCourse.alt}
                    width={800}
                    height={450}
                    className="h-auto w-full object-cover"
                  />
                </motion.div>
              </CardHeader>
              <CardContent className="p-6 max-h-[60vh] overflow-y-auto">
                <motion.h2 layoutId={`card-title-${selectedCourse.title}`} className="mb-4 text-2xl md:text-3xl font-bold text-white">
                  {selectedCourse.title}
                </motion.h2>
                <motion.p layoutId={`card-description-${selectedCourse.title}`} className="text-white/80">
                  {selectedCourse.description} This course offers a deep dive into the subject, covering advanced topics and providing hands-on exercises. It's designed for learners who want to go beyond the basics and master the material.
                </motion.p>
              </CardContent>
              <motion.button
                className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-white/20"
                onClick={() => setSelectedId(null)}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

    