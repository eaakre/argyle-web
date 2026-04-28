"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-text-secondary">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mt-6 mb-3 text-text-primary">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mt-5 mb-2 text-text-primary">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-5 mb-4 space-y-1 text-text-secondary">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-5 mb-4 space-y-1 text-text-secondary">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export function NewsBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
