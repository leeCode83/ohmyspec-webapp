import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Mono untuk label teknis: nomor sheet, dimensi, koordinat.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Manrope — sans geometris setengah-teknis: heading blueprint yang presisi
// tapi tetap ramah (sisi "Bob" dari tema).
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="sheet flex min-h-full flex-col">{children}</body>
    </html>
  );
}
