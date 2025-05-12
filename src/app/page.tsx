import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/70 p-6">
      <div className="text-center max-w-2xl mx-auto bg-card p-8 sm:p-12 rounded-xl shadow-2xl">
        <div className="mb-6">
          <Briefcase className="inline-block h-16 w-16 sm:h-20 sm:w-20 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Welcome to Branch Buddy
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your all-in-one School Management System for multi-branch institutions.
          Streamline administration, manage student data, and gain insights with ease.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="shadow-md">
            <Link href="/login">Login / Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-md border-primary/50 hover:bg-primary/10 hover:text-primary">
            <Link href="/login">Learn More</Link>
          </Button>
        </div>
      </div>
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Branch Buddy. All rights reserved.</p>
        <p className="opacity-75">Built with Next.js and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
