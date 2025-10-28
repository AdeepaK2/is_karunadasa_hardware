"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import CustomerSidebar from "@/components/CustomerSidebar";
import CustomerHeader from "@/components/CustomerHeader";
import NotificationSidebar from "@/components/NotificationSidebar";
import ThemeProvider from "@/components/ThemeProvider";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "customer") {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "customer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <CustomerSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <CustomerHeader />
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
          </div>
          <NotificationSidebar />
        </div>
      </NotificationProvider>
    </ThemeProvider>
  );
}
