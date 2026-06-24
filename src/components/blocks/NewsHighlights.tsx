import Image from "next/image";
import { getNewsHighlights } from "@/lib/sanity";
import { SanityImage } from "@/types/cms";
import { NewsCarousel } from "./NewsCarousel";
import Link from "next/link";

interface NewsHighlightsProps {
  image?: SanityImage;
  sectionTitle?: string;
}

export async function NewsHighlights({
  image,
  sectionTitle,
}: NewsHighlightsProps) {
  const articles = await getNewsHighlights();

  if (!articles?.length) return null;

  const imageUrl = image?.asset?.url;
  const title = sectionTitle ?? "News & Announcements";

  return (
    <section className="md:px-4 py-4 md:py-12 bg-bg-secondary">
      <div className="mx-auto max-w-screen-xl">
        {/* Mobile image — full width above carousel, hidden on desktop */}
        {imageUrl ? (
          <div className="relative h-48 w-full md:hidden overflow-hidden">
            <Link href="/news" className="group absolute inset-0 block">
              <Image
                src={imageUrl}
                alt={image?.alt ?? ""}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 z-10 pointer-events-none group-focus-visible:ring-[3px] group-focus-visible:ring-inset group-focus-visible:ring-accent"
              />
            </Link>
            <div className="absolute top-[20px] left-0 bg-accent/90 px-6 py-2">
              <h2 className="text-2xl md:text-3xl font-bold text-bg-primary uppercase">
                {title}
              </h2>
            </div>
          </div>
        ) : (
          <h2 className="text-2xl md:text-3xl font-bold uppercase text-text-primary mb-6">
            {title}
          </h2>
        )}

        {/* Two-column layout */}
        <div className="flex bg-bg-primary overflow-hidden min-h-80">
          {/* Left column: carousel */}
          <div className="flex-1 min-w-0">
            <NewsCarousel articles={articles} />
          </div>

          {/* Right column: full-bleed image, desktop only */}
          {imageUrl && (
            <div className="relative hidden md:block md:w-3/5 flex-shrink-0">
              <Link href="/news" className="group absolute inset-0 block">
                <Image
                  src={imageUrl}
                  alt={image?.alt ?? ""}
                  fill
                  className="object-cover"
                  sizes="60vw"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 z-10 pointer-events-none group-focus-visible:ring-[3px] group-focus-visible:ring-inset group-focus-visible:ring-accent"
                />
              </Link>
              <div className="absolute top-[20px] left-[-20] bg-accent px-12 py-2 pointer-events-none">
                <h2 className="text-2xl font-bold text-bg-primary py-4 uppercase">
                  {title}
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
