
"use client";

import Link from "next/link";
import { useState } from "react";
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
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc } from "firebase/firestore";
import type { AuthError, User } from "firebase/auth";

export default function SignupPage() {
  const { auth, firestore } = useFirebase();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = () => {
    if (!auth || !firestore) {
      setError("Authentication service is not available.");
      return;
    }
    setError(null); // Reset error state on new attempt

    const handleAuthError = (authError: AuthError) => {
      switch (authError.code) {
        case "auth/email-already-in-use":
          setError(
            "This email is already in use. Please try another email or log in."
          );
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please choose a stronger password.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        default:
          setError("An unexpected error occurred during sign-up. Please try again.");
          break;
      }
      console.error("Sign-up error:", authError);
    };

    const handleSuccess = (user: User) => {
       if (user && firestore) {
        const userRef = doc(firestore, "users", user.uid);
        const userData = {
          id: user.uid,
          email: user.email,
          name: `${firstName} ${lastName}`,
          dateJoined: new Date().toISOString(),
        };
        setDocumentNonBlocking(userRef, userData, { merge: true });
        router.push("/user");
       }
    };
    
    // Non-blocking call to sign up.
    initiateEmailSignUp(auth, email, password, handleAuthError, handleSuccess);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-tr from-[#000000] via-[#0c0c2c] to-[#1a0f35]">
      <StarsBackground />
      <div className="z-10 w-full max-w-md">
        <Card
          className="animate-fade-in-up border-white/20 bg-white/10 text-white backdrop-blur-sm"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader>
            <CardTitle
              className="animate-fade-in-up text-2xl"
              style={{ animationDelay: "0.3s" }}
            >
              Create an account
            </CardTitle>
            <CardDescription
              className="animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Enter your information to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div
                className="grid grid-cols-2 gap-4 animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    required
                    className="bg-black/20 text-white placeholder:text-gray-400"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    className="bg-black/20 text-white placeholder:text-gray-400"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div
                className="grid gap-2 animate-fade-in-up"
                style={{ animationDelay: "0.6s" }}
              >
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
              <div
                className="grid gap-2 animate-fade-in-up"
                style={{ animationDelay: "0.7s" }}
              >
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-black/20 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleSignUp();
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                className="w-full animate-fade-in-up"
                style={{ animationDelay: "0.8s" }}
                onClick={handleSignUp}
              >
                Create account
              </Button>
              {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-white/10 animate-fade-in-up"
                style={{ animationDelay: "0.9s" }}
              >
                Sign up with Google
              </Button>
            </div>
            <div
              className="mt-4 text-center text-sm animate-fade-in-up"
              style={{ animationDelay: "1.0s" }}
            >
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
