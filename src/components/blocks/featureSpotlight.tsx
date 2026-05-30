"use client";

import { useState } from "react";
import Image from "next/image";
// import Link from "next/link";
import { urlForImage } from "@/lib/sanity";
import { CTA, SanityImage } from "@/types/cms";
import { StyledLink } from "../ui/Link";

type FeatureSpotlightProps = {
  title: string;
  tagline?: string;
  description?: string;
  images?: SanityImage[];
  ctas?: CTA[];
};

function imageUrl(img: SanityImage): string {
  return img.asset?._ref
    ? urlForImage(img).width(1400).height(600).fit("crop").url()
    : (img.asset?.url ?? img.url ?? "");
}

export function FeatureSpotlight({
  title,
  tagline,
  description,
  images = [],
  ctas = [],
}: FeatureSpotlightProps) {
  const [current, setCurrent] = useState(0);
  const activeImage = images[current];

  return (
    <section className="bg-bg-secondary py-4 md:py-12">
      <div className="max-w-screen-xl mx-auto px-4 md:px-0">
        <div className="relative overflow-hidden h-80 md:h-[600px]">
          {/* Background image */}
          {activeImage && (
            <Image
              key={current}
              src={imageUrl(activeImage)}
              alt={activeImage.alt ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1152px"
              priority
            />
          )}

          {/* Left-side gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          {/* Text content — left side */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-xs md:max-w-md bg-black/50 py-12 px-6 md:px-10">
              {tagline && (
                <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
                  {tagline}
                </span>
              )}
              <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase leading-tight mb-3">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-white/75 mb-5 line-clamp-3 hidden md:block">
                  {description}
                </p>
              )}
              {ctas.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {ctas.map((cta, i) => (
                    <StyledLink href={cta.href} variant={cta.variant} key={i}>
                      {cta.text}
                    </StyledLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prev / next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((i) => Math.max(0, i - 1))}
                disabled={current === 0}
                aria-label="Previous image"
                className="cursor-pointer absolute right-12 bottom-4 w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setCurrent((i) => Math.min(images.length - 1, i + 1))
                }
                disabled={current === images.length - 1}
                aria-label="Next image"
                className="cursor-pointer absolute right-3 bottom-4 w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
              >
                ›
              </button>

              {/* Dots */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
                aria-hidden="true"
              >
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                      i === current ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
