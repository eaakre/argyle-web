"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity";
import { GalleryItem, EmblaGalleryProps } from "@/types/cms";

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      // Short link: https://youtu.be/VIDEO_ID
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    } else if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url; // fallback
  } catch {
    return url;
  }
}

function GallerySlide({ item, index }: { item: GalleryItem; index: number }) {
  if (item._type === "galleryImage" && item.image) {
    const url = item.image ? urlForImage(item.image)?.url() : "";
    return (
      <div className="w-full h-full relative bg-black/60 flex items-center justify-center">
        {url && (
          <Image
            src={url}
            alt={item.alt || item.caption || `Gallery image ${index + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 80vw, 80vw"
            priority={index === 0}
          />
        )}

        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
            <p className="text-sm">{item.caption}</p>
          </div>
        )}
      </div>
    );
  }

  if (item._type === "galleryVideo" && item.url) {
    const embedUrl = getYouTubeEmbedUrl(item.url);

    return (
      <div className="w-full h-full relative bg-black/60 flex items-center justify-center">
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg"
          allowFullScreen
          title={item.caption || "Video embed"}
        />
        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
            <p className="text-sm">{item.caption}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default function EmblaGallery({ title, images }: EmblaGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
  });
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi || !thumbsApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    thumbsApi.scrollTo(emblaApi.selectedScrollSnap());
  }, [emblaApi, thumbsApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="my-8 max-w-4xl mx-auto px-6">
      {title && <h3 className="text-2xl font-bold mb-4">{title}</h3>}

      <div className="space-y-4">
        {/* Main Gallery - Option 1: Fixed height with max-height */}
        <div className="relative">
          <div
            className="overflow-hidden rounded-lg bg-black/60 h-96 max-h-[600px]"
            ref={emblaRef}
          >
            <div className="flex h-full">
              {images.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                  <GallerySlide item={item} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Option 2: Responsive height with viewport units */}
          {/* 
          <div
            className="overflow-hidden rounded-lg bg-black/60 h-[60vh] max-h-[500px]"
            ref={emblaRef}
          >
            <div className="flex h-full">
              {images.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                  <GallerySlide item={item} index={index} />
                </div>
              ))}
            </div>
          </div>
          */}

          {/* Alternative Option 3: Different heights for mobile vs desktop */}
          {/* 
          <div
            className="overflow-hidden rounded-lg bg-black/60 h-64 sm:h-80 lg:h-96 max-h-[600px]"
            ref={emblaRef}
          >
            <div className="flex h-full">
              {images.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                  <GallerySlide item={item} index={index} />
                </div>
              ))}
            </div>
          </div>
          */}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 text-white p-2 rounded-full transition-all z-10"
                aria-label="Previous image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 text-white p-2 rounded-full transition-all z-10"
                aria-label="Next image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="overflow-hidden" ref={thumbsRef}>
            <div className="flex gap-3">
              {images.map((item, index) => {
                const url = item.image ? urlForImage(item.image)?.url() : "";
                return (
                  <div key={index} className="flex-[0_0_auto]">
                    <button
                      onClick={() => scrollTo(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedIndex === index
                          ? "border-accent"
                          : "border-transparent hover:border-secondary-foreground"
                      }`}
                    >
                      {item._type === "galleryImage" && item.image ? (
                        <Image
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-secondary-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm6 1a1 1 0 100 2h3a1 1 0 100-2H11z" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dots Pagination (alternative to thumbs) */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  selectedIndex === index
                    ? "bg-accent"
                    : "bg-text-primary/30 hover:bg-text-primary/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
