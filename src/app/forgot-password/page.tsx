"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call for password reset
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you'd call your backend API here
    toast({
      title: "Password Reset Link Sent",
      description: `If an account exists for ${email}, a password reset link has been sent. Please check your inbox.`,
    });
    setIsLoading(false);
    setEmail(""); // Clear email field after submission
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/70 p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
             <Briefcase className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Forgot Your Password?</CardTitle>
          <CardDescription>
            No worries! Enter your email address below and we'll send you a link to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10" // Add padding for the icon
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>
            <Button type="submit" className="w-full text-base py-3 shadow-md" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-6">
          <Link
            href="/login"
            className="text-sm text-primary hover:underline font-medium"
          >
            Back to Login
          </Link>
           <p className="text-xs text-muted-foreground mt-4">
            &copy; {new Date().getFullYear()} Branch Buddy. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
