import { getAllNewsArticles, SanityNewsArticle } from "@/lib/sanity";
import { generateSEOMetadata } from "@/lib/seo";
import { domainUrl } from "@/lib/constants";
import Link from "next/link";
import { NewsBody } from "@/components/NewsBody";
import { FileText, Calendar, Download } from "lucide-react";

export const metadata = generateSEOMetadata({
  title: "News – Argyle, MN",
  description: "City news, announcements, and council meeting minutes for Argyle, Minnesota.",
  canonicalUrl: `${domainUrl}/news`,
});

const CATEGORY_LABELS: Record<string, string> = {
  "council-minutes": "City Council Minutes",
  "public-notice": "Public Notice",
  "general-news": "General News",
  "announcement": "Announcement",
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return (
    <span className="text-xs px-2.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
      {CATEGORY_LABELS[category] ?? category}
    </span>
  );
}

function ArticleCard({ article }: { article: SanityNewsArticle }) {
  return (
    <div className="bg-bg-primary rounded-sm shadow-sm p-6 flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <CategoryBadge category={article.category} />
        <span className="flex items-center gap-1 text-xs text-text-secondary">
          <Calendar size={11} className="opacity-60" />
          {formatDate(article.date)}
        </span>
      </div>
      <h2 className="text-lg font-bold leading-snug text-text-primary">
        {article.title}
      </h2>
      {article.excerpt && (
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      )}
      <Link
        href={`/news/${article.slug.current}`}
        className="mt-auto inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors"
      >
        Read more →
      </Link>
    </div>
  );
}

export default async function NewsPage() {
  const articles = await getAllNewsArticles();
  const [latest, ...rest] = articles;

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
            News
          </h1>
          <p className="text-white/70 mt-2 text-sm">
            City updates, announcements, and council meeting minutes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {articles.length === 0 ? (
          <div className="py-20 text-center text-text-secondary">
            <FileText className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No articles yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Latest article — fully expanded */}
            {latest && (
              <div className="bg-bg-primary rounded-sm shadow-sm overflow-hidden">
                <div className="border-l-4 border-secondary px-8 pt-8 pb-2">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-xs px-2.5 py-0.5 bg-secondary text-primary rounded-full font-bold">
                      Latest
                    </span>
                    <CategoryBadge category={latest.category} />
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <Calendar size={11} className="opacity-60" />
                      {formatDate(latest.date)}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
                    {latest.title}
                  </h2>
                </div>
                <div className="px-8 pb-8">
                  {latest.body && latest.body.length > 0 ? (
                    <NewsBody value={latest.body} />
                  ) : latest.excerpt ? (
                    <p className="leading-relaxed text-text-secondary">
                      {latest.excerpt}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t border-bg-secondary">
                    {latest.pdfAttachment?.asset?.url && (
                      <a
                        href={latest.pdfAttachment.asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-sm hover:bg-accent transition-colors shadow-sm"
                      >
                        <Download size={14} />
                        Download PDF
                      </a>
                    )}
                    <Link
                      href={`/news/${latest.slug.current}`}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-sm hover:bg-gray-50 transition-colors"
                    >
                      Permalink →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Older articles */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">
                  Previous Articles
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {rest.map((article) => (
                    <ArticleCard key={article._id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
