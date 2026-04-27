import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Zimclick — The Ultimate Global Sports Marketplace",
  description: "Shop world-class sporting goods from premium soccer boots to elite cricket gear. Equip your passion and elevate your game with Zimclick.",
};

import { AuthProvider } from "@/components/providers/AuthProvider";
import ReduxProvider from "@/components/providers/ReduxProvider";
import StoreLayout from "@/components/layout/StoreLayout";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-3 focus:bg-brand focus:text-white focus:rounded-br-lg focus:font-bold focus:outline-none focus:ring-4 focus:ring-brand-light">
          Skip to content
        </a>
        <ReduxProvider>
          <AuthProvider>
            <StoreLayout>{children}</StoreLayout>
          </AuthProvider>
        </ReduxProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
