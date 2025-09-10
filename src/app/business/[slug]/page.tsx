// app/business/[slug]/page.tsx
import { getBusinessBySlug, getAllBusinesses, Business } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { domainUrl } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Globe, Mail, Clock } from "lucide-react";

type BusinessPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const businesses = await getAllBusinesses();
  return businesses.map((business: Business) => ({
    slug: business.slug?.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) return notFound();

  return generateSEOMetadata({
    title: `${business.name} - Argyle, MN Business Directory`,
    description:
      business.description ||
      `Find contact information and details for ${business.name} in Argyle, Minnesota.`,
    canonicalUrl: `${domainUrl}/business/${slug}`,
    ogImage: business.logo?.asset?.url || `${domainUrl}/default-og.jpg`,
  });
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) return notFound();

  const formatCategoryDisplay = (category: string) => {
    return category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatHours = (
    hours:
      | {
          monday?: string;
          tuesday?: string;
          wednesday?: string;
          thursday?: string;
          friday?: string;
          saturday?: string;
          sunday?: string;
        }
      | null
      | undefined
  ) => {
    if (!hours) return null;

    const daysOfWeek = [
      { key: "monday" as const, label: "Monday" },
      { key: "tuesday" as const, label: "Tuesday" },
      { key: "wednesday" as const, label: "Wednesday" },
      { key: "thursday" as const, label: "Thursday" },
      { key: "friday" as const, label: "Friday" },
      { key: "saturday" as const, label: "Saturday" },
      { key: "sunday" as const, label: "Sunday" },
    ];

    return daysOfWeek.map((day) => ({
      day: day.label,
      hours: hours[day.key] || "Closed",
    }));
  };

  const businessHours = formatHours(business.hours);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/business" className="hover:text-blue-600">
              Businesses
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{business.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              {business.logo && (
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <Image
                      src={business.logo.asset?.url || ""}
                      alt={business.logo.alt || `${business.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {business.name}
                    </h1>
                    {business.category && (
                      <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                        {formatCategoryDisplay(business.category)}
                      </span>
                    )}
                  </div>
                  {business.featured && (
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {business.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {business.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                {/* Address */}
                {business.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      {business.address.street && (
                        <div className="text-gray-900">
                          {business.address.street}
                        </div>
                      )}
                      <div className="text-gray-900">
                        {business.address.city}, {business.address.state}{" "}
                        {business.address.zipCode}
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a
                      href={`tel:${business.phone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {business.phone}
                    </a>
                  </div>
                )}

                {/* Website */}
                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all"
                    >
                      {business.website}
                    </a>
                  </div>
                )}

                {/* Email */}
                {business.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a
                      href={`mailto:${business.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {business.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Business Hours */}
            {businessHours && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Business Hours
                </h2>
                <div className="space-y-2">
                  {businessHours.map(({ day, hours }) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600">{day}</span>
                      <span
                        className={
                          hours === "Closed" ? "text-gray-400" : "text-gray-900"
                        }
                      >
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Back to Directory */}
          <div className="mt-8 text-center">
            <Link
              href="/business"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to Business Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
