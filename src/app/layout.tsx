import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xpedition Labs — Navigating Businesses To Their North Star",
  description: "Navigating Businesses To Their North Star",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-[Outfit,sans-serif] text-[#1C2A44] bg-[#F9FBFD] leading-[1.7] font-normal antialiased overflow-x-hidden m-0 p-0 box-border" suppressHydrationWarning>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
