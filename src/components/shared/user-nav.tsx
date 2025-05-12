// src/components/shared/user-nav.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon, ShieldAlert, Loader2 } from "lucide-react";
import { useImpersonation } from "@/context/impersonation-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { currentEffectiveUser, originalUser, isImpersonating, stopImpersonation, isLoadingOriginalUser } = useImpersonation();
  const router = useRouter();
  
  const userToDisplay = currentEffectiveUser;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("originalUser");
      localStorage.removeItem("impersonatedUserId");
    }
    router.push("/login");
  };

  if (isLoadingOriginalUser && !userToDisplay?.email) { // Show loader if original user is loading and no effective user to display
    return (
      <Button variant="ghost" className="relative h-9 w-9 rounded-full shadow-sm border border-input" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }
  
  if (!userToDisplay || !userToDisplay.email) { // Fallback if user is somehow still null after loading
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback>.. </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return "..";
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full shadow-sm border border-input">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userToDisplay.avatarUrl} alt={userToDisplay.name} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(userToDisplay.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userToDisplay.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userToDisplay.email} ({userToDisplay.role?.name})
            </p>
            {isImpersonating && originalUser && (
              <p className="text-xs leading-none text-yellow-600 mt-1">
                (Viewing as this user, logged in as {originalUser.name})
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile"> {/* Ensure /profile page exists or create it */}
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account-settings"> {/* Ensure /account-settings page exists or create it */}
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isImpersonating && originalUser?.role?.name === 'Super Admin' && (
          <>
            <DropdownMenuItem onClick={stopImpersonation} className="text-yellow-600 focus:bg-yellow-100 focus:text-yellow-700">
              <ShieldAlert className="mr-2 h-4 w-4" />
              <span>Stop Viewing As</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
