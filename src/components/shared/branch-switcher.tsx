// src/components/shared/branch-switcher.tsx
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Branch } from "@/types";
import { apiService } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function BranchSwitcher() {
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchBranches = async () => {
      setIsLoading(true);
      try {
        const fetchedBranches = await apiService.get<Branch[]>("/branches");
        setBranches(fetchedBranches);
        if (fetchedBranches.length > 0) {
          // Try to get stored selected branch or default to first
          const storedBranchId = typeof window !== "undefined" ? localStorage.getItem("selectedBranchId") : null;
          const initialBranchId = storedBranchId && fetchedBranches.find(b => b.id === storedBranchId) 
                                    ? storedBranchId 
                                    : fetchedBranches[0].id;
          setSelectedBranchId(initialBranchId);
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        toast({
          title: "Error",
          description: "Could not load branches.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranches();
  }, [toast]);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedBranchId", branchId);
      // Optionally, trigger a page reload or data refresh if branch context affects entire app
      // window.location.reload(); 
    }
    // You might want to use a global state/context for the selected branch
    // to make it available throughout the application easily.
  };
  
  const currentBranchName = branches.find(b => b.id === selectedBranchId)?.name;

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-auto min-w-[150px] md:min-w-[200px] text-sm h-9 shadow-sm">
          <SelectValue placeholder="Loading branches..." >
             <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
             </span>
          </SelectValue>
        </SelectTrigger>
      </Select>
    );
  }

  if (branches.length === 0 && !isLoading) {
     return (
      <Select disabled>
        <SelectTrigger className="w-auto min-w-[150px] md:min-w-[200px] text-sm h-9 shadow-sm">
          <SelectValue placeholder="No branches available" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedBranchId} onValueChange={handleBranchChange}>
      <SelectTrigger className="w-auto min-w-[150px] md:min-w-[200px] text-sm h-9 shadow-sm">
        <SelectValue placeholder="Select Branch">
          {currentBranchName || "Select Branch"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch) => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
