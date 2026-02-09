import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zapcart Admin",
  description: "Zapcart Ecommerce Admin Dashboard",
};

import { SidebarProvider } from "@/lib/SidebarContext";
import { LayoutWrapper } from "@/components/wrapper";
import { ReactQueryWrapper } from "@repo/ui/wrapper";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background`}>
        <ReactQueryWrapper>
          <SidebarProvider>
            <LayoutWrapper>
              <Toaster />
              {children}
            </LayoutWrapper>
          </SidebarProvider>
        </ReactQueryWrapper>
      </body>
    </html>
  );
}
