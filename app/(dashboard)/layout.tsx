import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { DashboardHeader } from "@/components/dashboard/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard - SchedulePro",
  description: "Manage your business scheduling",
};

import { BusinessDataProvider } from "@/components/providers/BusinessDataProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* <Sidebar /> */}
        <div className="flex h-screen overflow-hidden">
          {/* <Sidebar /> */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <DashboardHeader /> 
            <BusinessDataProvider>
              <main className="flex-1 p-4 md:p-6">
                {children}
              </main>
            </BusinessDataProvider>
          </div>
        </div>
        <Toaster />
      </div>
  );
}
