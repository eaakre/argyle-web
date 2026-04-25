"use client";

import { useState, useMemo } from "react";
import { Business } from "@/lib/sanity";
import { BusinessLink } from "@/components/blocks/businessLink";
import { Search } from "lucide-react";

interface BusinessDirectoryProps {
  businesses: Business[];
}

export function BusinessDirectory({ businesses }: BusinessDirectoryProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"nameAsc" | "nameDesc">("nameAsc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    businesses.forEach((b) => {
      if (b.category) cats.add(b.category);
    });
    return Array.from(cats).sort();
  }, [businesses]);

  const formatCategory = (cat: string) =>
    cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const isFiltering = search.trim() !== "" || selectedCategory !== "all";

  const filtered = useMemo(() => {
    let result = businesses;

    if (selectedCategory !== "all") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) =>
      sortBy === "nameAsc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [businesses, search, sortBy, selectedCategory]);

  const featuredBusinesses = filtered.filter((b) => b.featured);
  const regularBusinesses = filtered.filter((b) => !b.featured);

  return (
    <section className="py-12 bg-bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Local Businesses
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategory(cat)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "nameAsc" | "nameDesc")
            }
            className="px-4 py-2 border border-gray-300 rounded-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="nameAsc">Name: A–Z</option>
            <option value="nameDesc">Name: Z–A</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-text-secondary py-12">
            No businesses match your search.
          </p>
        ) : isFiltering ? (
          /* Flat grid when actively filtering/searching */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((business) => (
              <BusinessLink key={business._id} business={business} />
            ))}
          </div>
        ) : (
          /* Featured-first layout when browsing normally */
          <>
            {featuredBusinesses.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6">
                  Featured Businesses
                </h3>
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

            <div>
              {featuredBusinesses.length > 0 && (
                <h3 className="text-xl font-semibold mb-6">All Businesses</h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regularBusinesses.map((business) => (
                  <BusinessLink key={business._id} business={business} />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="text-center mt-8">
          <p className="text-text-secondary">
            Showing {filtered.length} business
            {filtered.length !== 1 ? "es" : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
