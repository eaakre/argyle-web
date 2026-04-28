import {
  getNewsArticleBySlug,
  getAllNewsArticleSlugs,
  SanityNewsArticle,
} from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { domainUrl } from "@/lib/constants";
import Link from "next/link";
import { NewsBody } from "@/components/NewsBody";
import { Calendar, Download } from "lucide-react";

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getAllNewsArticleSlugs();
  return articles.map((a) => ({ slug: a.slug?.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) return notFound();

  return generateSEOMetadata({
    title: `${article.title} – Argyle, MN`,
    description:
      article.excerpt?.slice(0, 155) || "City news from Argyle, Minnesota.",
    canonicalUrl: `${domainUrl}/news/${slug}`,
  });
}

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

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) return notFound();

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Breadcrumb */}
      <div className="bg-bg-secondary border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-text-secondary">
            <Link href="/" className="hover:text-text-hover">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/news" className="hover:text-text-hover">
              News
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="bg-bg-primary rounded-sm shadow-sm overflow-hidden">
          <div className="border-l-4 border-secondary px-8 pt-8 pb-2">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {article.category && (
                <span className="text-xs px-2.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                  {CATEGORY_LABELS[article.category] ?? article.category}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <Calendar size={11} className="opacity-60" />
                {formatDate(article.date)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
              {article.title}
            </h1>
          </div>

          <div className="px-8 pb-8">
            {article.body && article.body.length > 0 ? (
              <NewsBody value={article.body} />
            ) : article.excerpt ? (
              <p className="leading-relaxed text-text-secondary">
                {article.excerpt}
              </p>
            ) : (
              <p className="italic text-text-secondary">No content provided.</p>
            )}

            {article.pdfAttachment?.asset?.url && (
              <div className="mt-6 pt-6 border-t border-bg-secondary">
                <a
                  href={article.pdfAttachment.asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-sm hover:bg-accent transition-colors shadow-sm"
                >
                  <Download size={14} />
                  Download PDF
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-sm shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    </div>
  );
}
