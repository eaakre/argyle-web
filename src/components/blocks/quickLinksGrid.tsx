import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { urlForImage } from "@/lib/sanity";
import { SanityImage } from "@/types/cms";

interface QuickLink {
  title: string;
  description?: string;
  image?: SanityImage;
  icon?: string;
  url: string;
  isExternal?: boolean;
  _key?: string;
}

interface QuickLinksGridProps {
  title?: string;
  description?: string;
  links?: QuickLink[];
  columns?: number;
}

const GRADIENTS = [
  "linear-gradient(145deg, #1a0505, #540d0d)",
  "linear-gradient(145deg, #540d0d, #751b1b)",
  "linear-gradient(145deg, #751b1b, #8b2525)",
  "linear-gradient(145deg, #8b2525, #540d0d)",
  "linear-gradient(145deg, #540d0d, #1a0505)",
  "linear-gradient(145deg, #1a0505, #751b1b)",
];

const QuickLinksGrid = ({ title, links, columns = 3 }: QuickLinksGridProps) => {
  const gridCols =
    {
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  if (!links?.length) return null;

  return (
    <section className="py-4 md:py-16 bg-bg-primary">
      <div className="max-w-screen-xl mx-auto px-4">
        {title && (
          <div className="bg-accent inline-block mb-3 px-6 md:px-12 py-2 md:py-6">
            <h2 className="text-bg-primary text-2xl font-bold uppercase">
              {title}
            </h2>
          </div>
        )}

        <div className={`grid ${gridCols} gap-[10px]`}>
          {links?.map((link, index) => {
            const imageUrl = link.image?.asset?._ref
              ? urlForImage(link.image).width(600).height(320).url()
              : null;

            return (
              <a
                key={link._key ?? link.url}
                href={link.url}
                target={link.isExternal ? "_blank" : "_self"}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                className="group relative block h-60 overflow-hidden"
              >
                {/* Background: photo or gradient */}
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={link.image?.alt || link.title}
                    fill
                    className="object-cover transition-all duration-200 group-hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0 transition-all duration-200 group-hover:brightness-110"
                    style={{ background: GRADIENTS[index % GRADIENTS.length] }}
                  />
                )}

                {/* Dark gradient overlay — ensures text legibility over any background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(26,5,5,0.55)] to-transparent" />

                {/* Faded emoji icon — gradient cards only, when icon field is set */}
                {!imageUrl && link.icon && (
                  <div
                    className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 select-none"
                    aria-hidden="true"
                  >
                    {link.icon}
                  </div>
                )}

                {/* Footer: title + gold bar + arrow */}
                <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between px-3 pb-3">
                  <div>
                    <p className="text-white text-base font-bold uppercase tracking-widest mb-1">
                      {link.title}
                    </p>
                    <div className="w-[18px] h-[2px] bg-secondary" />
                  </div>
                  {link.isExternal ? (
                    <ExternalLink
                      size={22}
                      className="text-secondary flex-shrink-0"
                    />
                  ) : (
                    <ArrowRight
                      size={22}
                      className="text-secondary flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickLinksGrid;
