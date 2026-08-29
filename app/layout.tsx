import type { Metadata } from "next";
import { Marcellus, Manrope, Amiri } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FIQRTAALIM Partnership — Your Islamic Brand, Live in 30 Days",
  description: "Not mentorship. A done-for-you partnership. We build your Islamic e-commerce brand — store, ads, payments, logistics — and hand you ₹25,000 of opening stock, free.",
  openGraph: {
    title: "FIQRTAALIM Partnership — Your Islamic Brand, Live in 30 Days",
    description: "Done-for-you Islamic e-commerce. Store, ads, payments, logistics and your opening stock — one partnership, ₹29,899.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${marcellus.variable} ${manrope.variable} ${amiri.variable} antialiased bg-[#0A0908] text-[#F2EBDD]`}>
        {children}
      </body>
    </html>
  );
}
