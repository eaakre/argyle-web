"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

type GalleryImage = {
  asset: { _id: string; url: string };
  alt?: string;
};

export function EventGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, next, prev]);

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={img.asset._id}
            onClick={() => setActiveIndex(i)}
            className="aspect-square overflow-hidden rounded-sm bg-bg-primary shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={img.alt || `${title} photo ${i + 1}`}
          >
            <Image
              src={img.asset.url}
              alt={img.alt || `${title} photo ${i + 1}`}
              width={400}
              height={400}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-red-300 cursor-pointer"
            onClick={close}
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft size={40} />
          </button>

          <div
            className="relative w-full max-w-4xl aspect-video"
            {...swipeHandlers}
          >
            <Image
              src={images[activeIndex].asset.url}
              alt={
                images[activeIndex].alt || `${title} photo ${activeIndex + 1}`
              }
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight size={40} />
          </button>

          <div className="mt-6 flex gap-2 overflow-x-auto max-w-full px-4">
            {images.map((img, i) => (
              <button
                key={img.asset._id}
                onClick={() => setActiveIndex(i)}
                className={`relative w-20 h-20 flex-shrink-0 overflow-hidden rounded border-2 transition-colors ${i === activeIndex ? "border-white" : "border-transparent"}`}
                aria-label={img.alt || `Go to photo ${i + 1}`}
              >
                <Image
                  src={img.asset.url}
                  alt={img.alt || ""}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <div className="mt-3 text-white/50 text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
