"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type {
  PortableTextReactComponents,
  PortableTextMarkComponentProps,
  PortableTextTypeComponentProps,
} from "@portabletext/react";
import type { TypedObject, PortableTextBlock } from "@portabletext/types";
import { urlForImage } from "@/lib/sanity";
import { motion } from "framer-motion";
import { buttonVariants } from "../ui/Button";
import { CTA, SanityImage } from "../../types/cms";

interface PortableTextImageBlock extends TypedObject {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  caption?: string;
}

type TextBlockProps = {
  heading?: string;
  subheading?: string;
  content?: PortableTextBlock[];
  backgroundType?: "none" | "image" | "color";
  backgroundImage?: SanityImage;
  backgroundColor?: string;
  layout?: "single" | "two-column" | "sidebar-left" | "sidebar-right";
  align?: "left" | "center" | "right";
  maxWidth?: string;
  padding?: string;
  ctas?: CTA[];
};

// Custom components for PortableText
const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({
      value,
    }: PortableTextTypeComponentProps<PortableTextImageBlock>) => {
      if (!value?.asset) return null;

      return (
        <div className="my-8">
          <Image
            src={urlForImage(value).url()}
            alt={value?.alt || ""}
            width={800}
            height={600}
            className="rounded-lg shadow-lg mx-auto w-full object-contain"
          />
          {value?.caption && (
            <p className="text-sm text-gray-600 text-center mt-2 italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },

  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-8 mb-4 text-[var(--text-primary)]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-6 mb-3 text-[var(--text-primary)]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-medium mt-4 mb-2 text-[var(--text-primary)]">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[var(--accent)] pl-4 my-6 italic text-gray-600">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-[var(--text-primary)]">
        {children}
      </p>
    ),
  },

  marks: {
    strong: ({ children }: PortableTextMarkComponentProps) => (
      <strong className="font-semibold text-[var(--text-primary)]">
        {children}
      </strong>
    ),
    em: ({ children }: PortableTextMarkComponentProps) => (
      <em className="italic">{children}</em>
    ),
    underline: ({ children }: PortableTextMarkComponentProps) => (
      <u className="underline">{children}</u>
    ),
    link: ({
      value,
      children,
    }: PortableTextMarkComponentProps<TypedObject & { href?: string }>) => (
      <a
        href={value?.href ?? "#"}
        className="text-[var(--accent)] hover:underline"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={
          value?.href?.startsWith("http") ? "noopener noreferrer" : undefined
        }
      >
        {children}
      </a>
    ),
  },
};

export function TextBlock({
  heading,
  subheading,
  content,
  backgroundType = "none",
  backgroundImage,
  backgroundColor,
  layout = "single",
  align = "left",
  maxWidth = "max-w-4xl",
  padding = "py-4",
  ctas = [],
}: TextBlockProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  const layoutClasses = {
    single: "grid-cols-1",
    "two-column": "md:grid-cols-2 gap-2",
    "sidebar-left": "md:grid-cols-3 gap-2",
    "sidebar-right": "md:grid-cols-3 gap-2",
  }[layout];

  return (
    <section className={`relative w-full ${padding}`}>
      {/* Backgrounds */}
      {backgroundType === "image" && backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={urlForImage(backgroundImage).width(1600).height(800).url()}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>
      )}
      {backgroundType === "color" && backgroundColor && (
        <div
          className={`absolute inset-0 ${
            backgroundColor.startsWith("bg-") ? backgroundColor : ""
          }`}
          style={{
            backgroundColor: backgroundColor.startsWith("#")
              ? backgroundColor
              : undefined,
          }}
        />
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={`relative z-10 container mx-auto px-6 ${maxWidth} ${alignClass}`}
      >
        {/* Header */}
        {(heading || subheading) && (
          <div className={`mb-8 ${alignClass}`}>
            {subheading && (
              <p className="text-[var(--accent)] font-medium mb-2 text-sm uppercase tracking-wide">
                {subheading}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* Content Grid */}
        <div className={`grid ${layoutClasses}`}>
          {layout === "sidebar-left" && (
            <div className="md:col-span-1">
              <div className="sticky top-8">
                {/* Sidebar content could go here */}
                <div className="text-sm text-gray-600">
                  {/* <p>Related information or navigation could go here</p> */}
                </div>
              </div>
            </div>
          )}

          <div
            className={
              layout === "sidebar-left" || layout === "sidebar-right"
                ? "md:col-span-2"
                : ""
            }
          >
            {content && (
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={content}
                  components={portableTextComponents}
                />
              </div>
            )}
          </div>

          {layout === "sidebar-right" && (
            <div className="md:col-span-1">
              <div className="sticky top-8">
                {/* Sidebar content could go here */}
                <div className="text-sm text-gray-600">
                  <p>Related information or navigation could go here</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Actions */}
        {ctas && ctas.length > 0 && (
          <div
            className={`mt-8 flex gap-4 flex-wrap ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"}`}
          >
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
      </motion.div>
    </section>
  );
}
