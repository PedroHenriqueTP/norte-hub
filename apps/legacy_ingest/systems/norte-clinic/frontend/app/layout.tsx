import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "MedCura CRM",
  description: "Advanced Medical CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn(
        "min-h-screen bg-[#F8F9FA] font-sans antialiased text-slate-900",
        inter.variable,
        geistMono.variable
      )}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
