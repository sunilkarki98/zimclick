"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  
  // Routes that should NOT have the global store Navbar/Footer
  const isDashboard = pathname.startsWith("/admin") || (pathname.startsWith("/vendor") && pathname !== "/vendor/register");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div id="main-content" className="flex-1 mt-16">{children}</div>
      <Footer />
    </div>
  );
}
