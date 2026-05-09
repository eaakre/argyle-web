"use client";

import { useRef } from "react";
import Image from "next/image";

type GalleryImage = { asset: { _id: string; url: string }; alt?: string };

export function MYNDGallery({ images }: { images: GalleryImage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current);
  }

  function stopDrag() {
    dragging.current = false;
  }

  if (!images?.length) return null;

  return (
    <section className="py-10 bg-bg-secondary">
      <div className="container mx-auto px-4 mb-4">
        <h2 className="text-xl font-bold text-text-primary">Previous Years</h2>
      </div>
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto px-4 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none", height: 220 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {images.map((img, i) => (
          <div
            key={img.asset._id ?? i}
            className="relative flex-shrink-0 rounded-sm overflow-hidden"
            style={{ width: 320 }}
          >
            <Image
              src={img.asset.url}
              alt={img.alt || `Meet Your Neighbor Day photo ${i + 1}`}
              fill
              className="object-cover pointer-events-none"
              sizes="320px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
