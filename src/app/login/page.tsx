
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarsBackground } from "@/components/stars-background";
import { useFirebase } from "@/firebase/provider";
import { initiateEmailSignIn } from "@/firebase/non-blocking-login";
import type { AuthError } from "firebase/auth";

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/user");
    }
  }, [user, isUserLoading, router]);


  const handleLogin = () => {
    setError(null);
    // Special check for admin credentials
    if (email === "ADMIN" && password === "ADMIN") {
      router.push("/admin");
      return;
    }
    // Special check for user credentials
    if (email === "USER" && password === "USER") {
      router.push("/user");
      return;
    }

    if (!auth) {
      setError("Authentication service is not available.");
      return;
    }

    const handleAuthError = (authError: AuthError) => {
      switch (authError.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
          break;
      }
      console.error("Login error:", authError);
    };

    initiateEmailSignIn(auth, email, password, handleAuthError);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-tr from-[#000000] via-[#0c0c2c] to-[#1a0f35]">
      <StarsBackground />
      <div className="z-10 w-full max-w-md">
        <Card className="animate-fade-in-up border-white/20 bg-white/10 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-black/20 text-white placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-black/20 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
              {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
              <Button variant="outline" className="w-full bg-transparent hover:bg-white/10">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
