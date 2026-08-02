import type { Metadata, Viewport } from "next";
import { Manrope, Plus_Jakarta_Sans, Crimson_Pro } from "next/font/google";
import { ScrollRoot } from "@/components/ScrollRoot";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Assis | Change the position. Change everything.",
  description:
    "Your store is managed. Your customer relationship isn't. Assis takes responsibility for the relationship between your brand and your customers.",
  icons: {
    icon: "/brand/assis-heart-whatsapp.png",
    apple: "/brand/assis-heart-whatsapp.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${jakarta.variable} ${crimson.variable}`}>
      <body className="bg-white text-foreground antialiased" suppressHydrationWarning>
        <ScrollRoot>{children}</ScrollRoot>
      </body>
    </html>
  );
}
