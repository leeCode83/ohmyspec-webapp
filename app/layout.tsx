import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fraunces — display serif dramatis untuk judul horror ("carved, not typed").
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK"], // karakter quirky/wonky khas poster horor editorial
});

export const metadata: Metadata = {
  title: "OhmySpec: Every spec deserves closure",
  description:
    "Author, refine, and dispatch specs with an AI assistant. Unfinished specs come back to haunt your team, so give them closure with OhmySpec.",
  openGraph: {
    title: "OhmySpec: Every spec deserves closure",
    description:
      "Spec-driven development for small teams. Every spec is a soul that deserves closure.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
