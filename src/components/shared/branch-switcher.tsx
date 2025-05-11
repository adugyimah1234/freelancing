"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_BRANCHES } from "@/lib/constants";
import type { Branch } from "@/types";

export function BranchSwitcher() {
  const [branches] = React.useState<Branch[]>(MOCK_BRANCHES);
  const [selectedBranch, setSelectedBranch] = React.useState<string>(
    branches[0]?.id || ""
  );

  // In a real app, this would likely come from user context or API
  const currentBranch = branches.find(b => b.id === selectedBranch);

  return (
    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
      <SelectTrigger className="w-auto min-w-[150px] md:min-w-[200px] text-sm h-9 shadow-sm">
        <SelectValue placeholder="Select Branch">
          {currentBranch?.name || "Select Branch"}
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
