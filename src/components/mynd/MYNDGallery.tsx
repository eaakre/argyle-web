"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = { asset: { _id: string; url: string }; alt?: string };

export function MYNDGallery({ images }: { images: GalleryImage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const didDrag = useRef(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
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
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    didDrag.current = false;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const delta = x - startX.current;
    if (Math.abs(delta) > 4) didDrag.current = true;
    ref.current.scrollLeft = scrollLeft.current - delta;
  }

  function stopDrag() {
    dragging.current = false;
  }

  if (!images?.length) return null;

  return (
    <>
      <section className="py-10 bg-bg-secondary">
        <div className="container mx-auto px-4">
          <div
            ref={ref}
            className="flex gap-3 overflow-x-auto cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "none", height: 220 }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            {images.map((img, i) => (
              <button
                key={img.asset._id ?? i}
                className="relative flex-shrink-0 rounded-sm overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                style={{ width: 320, height: 220 }}
                aria-label={img.alt || `View photo ${i + 1}`}
                onClick={() => { if (!didDrag.current) setActiveIndex(i); }}
              >
                <Image
                  src={img.asset.url}
                  alt={img.alt || `Meet Your Neighbor Day photo ${i + 1}`}
                  fill
                  className="object-cover pointer-events-none"
                  sizes="320px"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft size={40} />
          </button>

          <div className="relative w-full max-w-[600px] h-[70vh]">
            <Image
              src={images[activeIndex].asset.url}
              alt={images[activeIndex].alt || `Meet Your Neighbor Day photo ${activeIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer z-10"
            aria-label="Next photo"
          >
            <ChevronRight size={40} />
          </button>

          <div className="mt-3 text-white/50 text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
