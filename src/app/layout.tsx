import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileSOSButton from "@/components/MobileSOSButton";
import FCMInitializer from "@/components/FCMInitializer";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rapid Rescuers",
  description: "Real-time blood availability & nearest donor network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}> 
        <FCMInitializer />
        {children}
        <MobileSOSButton/>
      </body>
    </html>
  );
}
