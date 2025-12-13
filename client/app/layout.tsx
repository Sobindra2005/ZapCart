import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ZapCart - Your Electronics Store",
  description: "Shop the latest electronics, headphones, and accessories at great prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "font-sans antialiased")}>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
