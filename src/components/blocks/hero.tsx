"use client";

import Image from "next/image";
import { urlForImage } from "@/lib/sanity";
import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import { CTA, SanityImage } from "../../types/cms";

type HeroProps = {
  heading?: string;
  subheading?: string;
  backgroundType?: "image" | "video" | "color";
  backgroundImage?: SanityImage;
  backgroundVideoUrl?: string;
  backgroundColor?: string;
  fullWidth?: boolean;
  ctas?: CTA[];
  align?: "left" | "center" | "right";
  isHomepage?: boolean;
};

export function Hero({
  heading,
  subheading,
  backgroundType = "image",
  backgroundImage,
  backgroundVideoUrl,
  backgroundColor = "#111827", // default bg-gray-900
  ctas = [],
  align = "center",
  isHomepage = false,
}: HeroProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align];

  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Homepage Decorative Border */}
      {isHomepage && (
        <>
          {/* Top Left Corner */}
          <div
            className="absolute top-0 left-0 w-32 h-32 z-30"
            style={{
              background: "#6B1F2D",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
          />

          {/* Top Right Corner */}
          <div
            className="absolute top-0 right-0 w-32 h-32 z-30"
            style={{
              background: "#DAA520",
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
            }}
          />

          {/* Bottom Left Corner */}
          <div
            className="absolute bottom-0 left-0 w-32 h-32 z-30"
            style={{
              background: "#DAA520",
              clipPath: "polygon(0 0, 100% 100%, 0 100%)",
            }}
          />

          {/* Bottom Right Corner */}
          <div
            className="absolute bottom-0 right-0 w-32 h-32 z-30"
            style={{
              background: "#6B1F2D",
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            }}
          />

          {/* Optional: Add smaller inner triangles for layered effect */}
          <div
            className="absolute top-0 left-0 w-24 h-24 z-40"
            style={{
              background: "#DAA520",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
              transform: "translate(8px, 8px)",
            }}
          />

          <div
            className="absolute top-0 right-0 w-24 h-24 z-40"
            style={{
              background: "#6B1F2D",
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              transform: "translate(-8px, 8px)",
            }}
          />

          <div
            className="absolute bottom-0 left-0 w-24 h-24 z-40"
            style={{
              background: "#6B1F2D",
              clipPath: "polygon(0 0, 100% 100%, 0 100%)",
              transform: "translate(8px, -8px)",
            }}
          />

          <div
            className="absolute bottom-0 right-0 w-24 h-24 z-40"
            style={{
              background: "#DAA520",
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              transform: "translate(-8px, -8px)",
            }}
          />
        </>
      )}

      {/* Backgrounds */}
      {backgroundType === "image" && backgroundImage && (
        <Image
          src={urlForImage(backgroundImage).width(1600).height(580).url()}
          alt={heading ?? ""}
          fill
          priority
          className="object-cover w-full h-full"
        />
      )}
      {backgroundType === "video" && backgroundVideoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 object-cover w-full h-full"
        >
          <source src={backgroundVideoUrl} type="video/mp4" />
        </video>
      )}
      {backgroundType === "color" && (
        <div
          className={`absolute inset-0 ${backgroundColor.startsWith("bg-") ? backgroundColor : ""}`}
          style={{
            backgroundColor: backgroundColor.startsWith("#")
              ? backgroundColor
              : undefined,
          }}
        />
      )}

      {/* Overlay */}
      {((heading && heading.length) ||
        (subheading && subheading.length) ||
        (ctas && ctas?.length)) && (
        <div className="absolute inset-0 bg-black/50 z-10" />
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-20 px-6 text-white flex flex-col max-w-screen-xl w-full ${alignClass}`}
      >
        <div className="max-w-3xl space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg md:text-xl text-gray-200">{subheading}</p>
          )}
          {ctas && ctas?.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-center">
              {ctas.map((cta, i) => (
                <Link
                  key={i}
                  href={cta.href}
                  className={buttonVariants({
                    variant: cta.variant ?? "default",
                    size: cta.size ?? "default",
                  })}
                >
                  {cta.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
