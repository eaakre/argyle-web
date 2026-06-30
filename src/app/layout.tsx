import type { Metadata } from "next";
import { Lato, Raleway } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAnnouncements, getNavLinks } from "@/lib/sanity";
import { draftMode, headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SanityLive } from "@/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { StyledLink } from "@/components/ui/Link";

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

const PRODUCTION_HOSTS = ["ci.argyle.mn.us"];

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  const isProduction = PRODUCTION_HOSTS.includes(host);
  return {
    title: "City of Argyle",
    description: "The Home in Hometown",
    ...(!isProduction && { robots: { index: false, follow: false } }),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [announcements, navLinks, { isEnabled: isDraftMode }] =
    await Promise.all([getAnnouncements(true), getNavLinks(), draftMode()]);

  return (
    <html lang="en">
      <body className={`${raleway.variable} ${lato.variable} antialiased`}>
        <Header announcements={announcements} navLinks={navLinks} />
        <div className="min-h-[100vh]">{children}</div>
        <Footer />
        <Analytics />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
        {isDraftMode && (
          <div className="flex gap-4 flex-col md:flex-row justify-between w-full sticky border-t-2 border-text-primary z-[999] bottom-0 bg-gray-200 p-4 px-4 md:px-20">
            <p>
              You are in draft mode. Click here to resume viewing published
              content
            </p>
            <StyledLink href="/api/draft-mode/disable" variant="default">
              Exit Preview
            </StyledLink>
          </div>
        )}
      </body>
    </html>
  );
}
