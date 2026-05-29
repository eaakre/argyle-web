import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity";
import { buttonVariants } from "@/components/ui/Button";
import { CTA, SanityImage } from "@/types/cms";

type FeatureSpotlightProps = {
  title: string;
  tagline?: string;
  description?: string;
  images?: SanityImage[];
  ctas?: CTA[];
};

export function FeatureSpotlight({
  title,
  tagline,
  description,
  images = [],
  ctas = [],
}: FeatureSpotlightProps) {
  const [heroImage, ...thumbnails] = images;

  return (
    <section className="w-full py-12">
      <div className="max-w-screen-xl mx-auto px-4 space-y-6">
        {/* Title block */}
        <div>
          {tagline && (
            <p className="text-lg italic text-muted-foreground mb-1">{tagline}</p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        </div>

        {/* Hero image */}
        {heroImage && (
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src={heroImage.asset?._ref ? urlForImage(heroImage).width(1200).height(900).url() : (heroImage.asset?.url ?? heroImage.url ?? "")}
              alt={heroImage.alt ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
        )}

        {/* Thumbnail strip */}
        {thumbnails.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {thumbnails.map((img, i) => (
              <div
                key={img._key ?? i}
                className="relative flex-shrink-0 w-40 aspect-[4/3] rounded-md overflow-hidden"
              >
                <Image
                  src={img.asset?._ref ? urlForImage(img).width(320).height(240).url() : (img.asset?.url ?? img.url ?? "")}
                  alt={img.alt ?? `${title} image ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-base text-muted-foreground max-w-2xl">{description}</p>
        )}

        {/* CTAs */}
        {ctas.length > 0 && (
          <div className="flex flex-wrap gap-3">
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
    </section>
  );
}
