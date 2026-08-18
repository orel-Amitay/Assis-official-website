import type { Metadata, Viewport } from "next";
import { Manrope, Plus_Jakarta_Sans, Crimson_Pro } from "next/font/google";
import { ScrollRoot } from "@/components/ScrollRoot";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Assis | The customer side of your e-commerce business",
  description:
    "Assis manages the relationship between your e-commerce business and your customers - the operating layer that grows revenue, trust, and better decisions.",
  icons: {
    icon: "/brand/assis-heart-classic.png",
    apple: "/brand/assis-heart-classic.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${jakarta.variable} ${crimson.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-foreground antialiased" suppressHydrationWarning>
        <ScrollRoot>{children}</ScrollRoot>
      </body>
    </html>
  );
}
