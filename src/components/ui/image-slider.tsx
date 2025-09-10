"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { urlForImage } from "@/lib/sanity";
import { useSwipeable } from "react-swipeable";
import { SanityImage } from "@/types/cms";

type ImageSliderProps = {
  images: SanityImage[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (index: number) => void;
};

export function ImageSlider({
  images,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  onSelect,
}: ImageSliderProps) {
  const current = images[activeIndex];

  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling on unmount
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Handler to close modal only if overlay (background) is clicked
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the clicked element IS the overlay div itself (not child elements), close
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: onNext,
    onSwipedRight: onPrev,
    trackMouse: true,
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-red-300 cursor-pointer"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={32} />
      </button>

      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer"
      >
        <ChevronLeft size={40} />
      </button>

      <div
        className="relative w-full max-w-4xl aspect-video"
        {...swipeHandlers}
      >
        <Image
          src={urlForImage(current).width(1600).height(900).url()}
          alt={current.alt || ""}
          fill
          className="object-contain rounded"
        />
      </div>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer"
      >
        <ChevronRight size={40} />
      </button>

      <div className="mt-6 flex gap-2 overflow-x-auto max-w-full px-4">
        {images.map((img, index) => (
          <div
            key={img._key ?? index}
            className={`relative w-20 h-20 cursor-pointer border-2 rounded overflow-hidden ${index === activeIndex ? "border-white" : "border-transparent"}`}
            onClick={() => onSelect(index)}
          >
            <Image
              src={urlForImage(img).width(160).height(160).url()}
              alt={img.alt || ""}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
