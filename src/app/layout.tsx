import type { Metadata } from "next";
// Nav and Footer are commented out: the homepage HTML (public/xpedition-labs.html)
// ships its own header and footer. /services renders them itself.
// import Nav from "@/components/Nav";
// import Footer from "@/components/Footer";
import "./globals.css";

const siteTitle = "Xpedition Labs — Building the next generation of crop innovation";
const siteDescription =
  "Xpedition Labs identifies high-value opportunities in agriculture and transforms them into commercially relevant products.";

// Icons and share images come from the files in src/app
// (icon.svg, favicon.ico, apple-icon.png, opengraph-image.png, twitter-image.png).
export const metadata: Metadata = {
  metadataBase: new URL("https://xpeditionlabs.com"),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "Xpedition Labs",
    title: siteTitle,
    description: siteDescription,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-[Outfit,sans-serif] text-[#1C2A44] bg-[#F9FBFD] leading-[1.7] font-normal antialiased overflow-x-hidden m-0 p-0 box-border" suppressHydrationWarning>
        {/* <Nav /> */}
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
