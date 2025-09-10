import Link from "next/link";
import Image from "next/image";
import { Business } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanity";

interface BusinessLinkProps {
  business: Business;
  className?: string;
}

export function BusinessLink({ business, className = "" }: BusinessLinkProps) {
  const imageSrc = business.logo ? urlForImage(business.logo).url() : "";
  return (
    <Link
      href={`/business/${business.slug?.current}`}
      className={`group block bg-bg-primary rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden ${className}`}
    >
      <div className="p-6">
        {/* Logo Section */}
        {business.logo && imageSrc && (
          <div className="mb-4 flex justify-center">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={imageSrc}
                alt={business.logo.alt || `${business.name} logo`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Business Name */}
        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors mb-2">
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
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {business.category
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        )}

        {/* Featured Badge */}
        {business.featured && (
          <div className="mt-3">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
