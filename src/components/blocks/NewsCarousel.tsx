"use client";

import { StyledLink } from "../ui/Link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SanityNewsArticle } from "@/lib/sanity";
import { Calendar } from "lucide-react";

function formatDate(dateString: string) {
  return new Date(dateString + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type NewsSlide = Pick<
  SanityNewsArticle,
  "_id" | "title" | "slug" | "date" | "excerpt" | "pinned"
>;

interface NewsCarouselProps {
  articles: NewsSlide[];
}

export function NewsCarousel({ articles }: NewsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const isInitialMount = useRef(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setAnnouncement(
      `Article ${selectedIndex + 1} of ${articles.length}: ${articles[selectedIndex].title}`,
    );
  }, [selectedIndex, articles]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!articles.length) return null;

  return (
    <div
      className="flex flex-col h-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="News articles"
    >
      {/* Screen reader live announcement */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Embla viewport */}
      <div className="overflow-hidden flex-1" ref={emblaRef}>
        <div className="flex h-full">
          {articles.map((article, i) => (
            <div
              key={article._id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${articles.length}`}
              aria-hidden={i !== selectedIndex ? true : undefined}
              {...(i !== selectedIndex ? { inert: true } : {})}
              className="flex-[0_0_100%] min-w-0 px-8 py-8 flex flex-col justify-center border-l-2 border-accent"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-3 block">
                {article.pinned ? "Pinned" : "Latest News"}
              </span>
              <h3 className="text-2xl font-extrabold text-text-primary uppercase leading-tight mb-3">
                {article.title}
              </h3>
              <div className="flex flex-col gap-1 mb-4">
                <time
                  dateTime={article.date}
                  className="text-sm text-text-secondary"
                >
                  <span aria-hidden="true">
                    <Calendar
                      size={16}
                      className="inline-flex flex-shrink-0 mt-0.5 text-accent"
                    />
                  </span>{" "}
                  {formatDate(article.date)}
                </time>
              </div>
              {article.excerpt && (
                <p className="text-sm text-text-secondary line-clamp-3 mb-6">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4">
                <StyledLink
                  href={`/news/${article.slug.current}`}
                  aria-label={`Read more about ${article.title}`}
                >
                  Read More
                </StyledLink>
                <StyledLink href="/news" variant="underline">
                  See all news →
                </StyledLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls: prev arrow · dots · next arrow */}
      <div className="flex items-center gap-3 px-8 pb-6">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous article"
          className={`w-8 h-8 cursor-pointer disabled:cursor-default rounded-full border border-text-text-primary/20 flex items-center justify-center text-text-primary transition-opacity ${
            !canScrollPrev
              ? "opacity-40"
              : "hover:border-primary hover:text-primary"
          }`}
        >
          ‹
        </button>

        <div className="flex gap-2" aria-hidden="true">
          {articles.map((_, i) => (
            <span
              key={articles[i]._id}
              className={`block w-2.5 h-2.5 rounded-full transition-colors ${
                i === selectedIndex
                  ? "bg-text-primary"
                  : "bg-text-primary/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next article"
          className={`w-8 h-8 cursor-pointer disabled:cursor-default rounded-full border border-text-text-primary/20 flex items-center justify-center text-text-primary transition-opacity ${
            !canScrollNext
              ? "opacity-40"
              : "hover:border-primary hover:text-text-primary"
          }`}
        >
          ›
        </button>
      </div>
    </div>
  );
}
