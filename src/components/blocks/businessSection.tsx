import { Business, getAllBusinesses } from "@/lib/sanity";
import { BusinessLink } from "./businessLink";

interface BusinessesSectionProps {
  className?: string;
  title?: string;
  showFeaturedFirst?: boolean;
  categoryFilter?: string;
  limit?: number;
}

export async function BusinessesSection({
  className = "",
  title = "Local Businesses",
  showFeaturedFirst = true,
  categoryFilter,
  limit,
}: BusinessesSectionProps) {
  const businesses = await getAllBusinesses({
    orderBy: showFeaturedFirst ? "featuredFirst" : "nameAsc",
    category: categoryFilter,
    limit,
  });

  if (!businesses || businesses.length === 0) {
    return (
      <section className={className}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
          <p className="text-center">No businesses found at the moment.</p>
        </div>
      </section>
    );
  }

  const featuredBusinesses: Business[] = businesses.filter(
    (business: Business) => business.featured
  );
  const regularBusinesses: Business[] = businesses.filter(
    (business: Business) => !business.featured
  );

  return (
    <section className={`py-12 bg-bg-secondary ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>

        {/* Featured Businesses */}
        {featuredBusinesses.length > 0 && showFeaturedFirst && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">Featured Businesses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((business) => (
                <BusinessLink
                  key={business._id}
                  business={business}
                  className="transform hover:scale-105 transition-transform duration-200"
                />
              ))}
            </div>
          </div>
        )}

        {/* All Businesses or Regular Businesses */}
        <div>
          {featuredBusinesses.length > 0 && showFeaturedFirst && (
            <h3 className="text-xl font-semibold mb-6">All Businesses</h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(showFeaturedFirst ? regularBusinesses : businesses).map(
              (business: Business) => (
                <BusinessLink key={business._id} business={business} />
              )
            )}
          </div>
        </div>

        {/* Business Count */}
        <div className="text-center mt-8">
          <p className="text-text-secondary">
            Showing {businesses.length} business
            {businesses.length !== 1 ? "es" : ""}
            {categoryFilter &&
              ` in ${categoryFilter.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`}
          </p>
        </div>
      </div>
    </section>
  );
}
