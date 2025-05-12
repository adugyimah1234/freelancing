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
import { Briefcase } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/70 p-6">
      <Card className="w-full max-w-md shadow-2xl text-center">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            User registration is currently handled by administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            If you require an account for Branch Buddy, please contact your designated system administrator. 
            They will be able to create an account and provide you with login credentials.
          </p>
          <Button asChild className="w-full text-base py-3 shadow-md">
            <Link href="/login">
              Back to Login
            </Link>
          </Button>
        </CardContent>
         <CardFooter className="flex flex-col items-center space-y-2 pt-6">
           <p className="text-xs text-muted-foreground mt-4">
            &copy; {new Date().getFullYear()} Branch Buddy. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
