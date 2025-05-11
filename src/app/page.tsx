import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6">
      <div className="text-center max-w-2xl mx-auto bg-card p-8 sm:p-12 rounded-xl shadow-2xl">
        <Briefcase className="h-20 w-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Welcome to Branch Buddy
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your all-in-one School Management System for multi-branch institutions.
          Streamline administration, manage student data, and gain insights with ease.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="shadow-md">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-md">
            <Link href="/learn-more">Learn More</Link>
          </Button>
        </div>
      </div>
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Branch Buddy. All rights reserved.</p>
        <p>Built with Next.js and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
