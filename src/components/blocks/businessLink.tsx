import Link from "next/link";
import Image from "next/image";
import { Business } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanity";

interface BusinessLinkProps {
  business: Business;
  className?: string;
}

function BusinessInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-28 h-28 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
      <span className="text-5xl font-bold text-secondary">{initials}</span>
    </div>
  );
}

export function BusinessLink({ business, className = "" }: BusinessLinkProps) {
  const imageSrc = business.logo ? urlForImage(business.logo).url() : "";
  return (
    <Link
      href={`/business/${business.slug?.current}`}
      className={`group block bg-bg-primary rounded-sm shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Logo area — always rendered for consistent card height */}
      <div className="relative h-36 bg-bg-secondary flex items-center justify-center">
        {business.logo && imageSrc ? (
          <Image
            src={imageSrc}
            alt={business.logo.alt || `${business.name} logo`}
            fill
            className="object-contain p-6"
          />
        ) : (
          <BusinessInitials name={business.name} />
        )}
      </div>

      <div className="p-5">
        {/* Business Name */}
        <h3 className="text-lg font-semibold group-hover:text-text-secondary transition-colors mb-2">
          {business.name}
        </h3>

        {/* Address */}
        {business.address && (
          <div className="text-sm text-text-secondary mb-2">
            {business.address.street && <div>{business.address.street}</div>}
            <div>
              {business.address.city}, {business.address.state}{" "}
              {business.address.zipCode}
            </div>
          </div>
        )}

        {/* Description */}
        {business.description && (
          <p className="text-sm text-text-secondary line-clamp-3 mb-3">
            {business.description}
          </p>
        )}

        {/* Category */}
        {business.category && (
          <span className="badge badge-neutral">
            {business.category
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        )}

        {/* Featured Badge */}
        {business.featured && (
          <div className="mt-3">
            <span className="badge badge-secondary">Featured</span>
          </div>
        )}
      </div>
    </Link>
  );
}
