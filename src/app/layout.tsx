import type { Metadata } from "next";
import "./globals.css";
import { Kantumruy_Pro, Moul } from "next/font/google";
import { cn } from "@/lib/utils";

const kantumruy = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  variable: "--font-kantumruy",
  weight: ["300", "400", "500", "600", "700"],
});

const moul = Moul({
  subsets: ["khmer"],
  variable: "--font-moul",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ប្រព័ន្ធគ្រប់គ្រងវត្តមាន - Attendance System",
  description: "Attendance system for teachers",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km" className={cn("font-sans", kantumruy.variable, moul.variable)}>
      <body
        className={`antialiased font-sans bg-[#fafbfc] text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
