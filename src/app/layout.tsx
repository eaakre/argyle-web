import type { Metadata } from "next";
import { Lato, Raleway } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAnnouncements, getNavLinks } from "@/lib/sanity";
import { draftMode } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SanityLive } from "@/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "City of Argyle",
  description: "The Home in Hometown",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [announcements, navLinks, { isEnabled: isDraftMode }] = await Promise.all([
    getAnnouncements(true),
    getNavLinks(),
    draftMode(),
  ]);

  return (
    <html lang="en">
      <body className={`${raleway.variable} ${lato.variable} antialiased`}>
        <Header announcements={announcements} navLinks={navLinks} />
        <div className="min-h-[100vh]">{children}</div>
        <Footer />
        <Analytics />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
