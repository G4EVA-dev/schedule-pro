"use client";

import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Menu, Calendar, Plus } from "lucide-react";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "../ui/theme-toggle";

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/calendar': 'Calendar',
  '/clients': 'Clients',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export function DashboardHeader() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const currentPageName = pageNames[pathname] || 'Dashboard';

  if (isLoading) {
    return (
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="relative ml-auto flex-1 md:grow-0">
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </header>
    );
  }

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-2 lg:gap-4 min-w-0">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="font-semibold truncate max-w-[90px]" title={currentPageName}>{currentPageName}</span>
        </div>
        <div className="hidden lg:block min-w-0">
          <h1 className="text-lg font-semibold truncate" title={currentPageName} aria-label="Page title">{currentPageName}</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center min-w-0">
        <div className="relative w-full max-w-md">
          <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors pointer-events-none ${
            isSearchFocused ? 'text-primary' : 'text-muted-foreground'
          }`} aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search appointments, clients..."
            className="w-full rounded-lg bg-muted/50 pl-9 pr-4 focus:bg-background focus-visible:ring-2 focus-visible:ring-primary"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            aria-label="Search appointments, clients"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Quick Add Button */}
        <ThemeToggle />
        
        <NotificationDropdown />
        {/* User Menu */}
        <UserMenu user={user} />
      </div>
    </header>
  );
}
