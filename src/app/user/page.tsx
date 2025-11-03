
"use client";

import { StarsBackground } from "@/components/stars-background";
import { ShimmerButton } from "@/components/ui/shimmer-button";
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
import { Search, UserCircle } from "lucide-react";
import placeholderImages from "@/lib/placeholder-images.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc } from "firebase/firestore";

interface UserProfile {
  name: string;
  // include other profile fields if necessary
}

export default function UserPage() {
  const { auth, user, firestore } = useFirebase();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (firestore && user) {
      return doc(firestore, "users", user.uid);
    }
    return null;
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const handleScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const coursesSection = document.getElementById("courses-section");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
      router.push("/");
    }
  };

  const displayName = isProfileLoading ? "Loading..." : userProfile?.name || "User";

  return (
    <div className="bg-gradient-to-tr from-[#000000] via-[#0c0c2c] to-[#1a0f35] text-white">
      <header className="sticky top-0 z-20 p-4 bg-transparent backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg sm:text-2xl font-bold text-white truncate">
            Welcome, {displayName}!
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                <UserCircle className="h-8 w-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-white/20 bg-black/50 text-white backdrop-blur-lg" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>My Learnings</DropdownMenuItem>
              <DropdownMenuItem>My Progress</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden -mt-20 p-4">
        <StarsBackground />
        <div className="z-10 flex flex-col items-center text-center">
          <h1
            className="animate-fade-in-up text-4xl sm:text-5xl font-bold text-white md:text-7xl"
            style={{ animationDelay: "0.2s" }}
          >
            Your Learning Universe
          </h1>
          <div className="mt-8 flex gap-4">
            <div
              className="animate-fade-in-up transition-transform duration-300 ease-in-out active:scale-95"
              style={{ animationDelay: "0.8s" }}
            >
              <ShimmerButton onClick={handleScroll}>Explore Courses</ShimmerButton>
            </div>
          </div>
        </div>
      </main>

      <section id="courses-section" className="py-20 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="mb-12 flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Explore Our Courses</h2>
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
            {placeholderImages.courses.map((course, index) => (
              <Link href={`/courses/${encodeURIComponent(course.title)}`} key={index}>
                <Card
                  className="flex h-full transform flex-col overflow-hidden rounded-lg border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <CardHeader className="p-0">
                    <Image
                      src={course.src}
                      alt={course.alt}
                      width={600}
                      height={400}
                      className="h-48 w-full object-cover"
                      data-ai-hint={course.hint}
                    />
                  </CardHeader>
                  <CardContent className="flex-grow p-6">
                    <CardTitle className="mb-2 text-xl font-bold text-white">
                      {course.title}
                    </CardTitle>
                    <p className="text-white/80">{course.description}</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
