import Link from "next/link";
import { getNewsHighlights } from "@/lib/sanity";

export async function NewsHighlights() {
  const articles = await getNewsHighlights();

  if (!articles?.length) return null;

  return (
    <section className="px-4 py-12 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          News &amp; Announcements
        </h2>
        <Link
          href="/news"
          className="text-sm font-medium text-primary hover:underline"
        >
          See all news →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={article._id}
            href={`/news/${article.slug.current}`}
            className="block group"
          >
            <div
              className={`h-full rounded-lg border p-5 transition-shadow hover:shadow-md ${
                article.pinned
                  ? "bg-secondary/15 border-secondary/40"
                  : "bg-bg-secondary border-text-primary/10"
              }`}
            >
              {article.pinned && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mb-3">
                  <span aria-hidden="true">📌</span> Pinned
                </span>
              )}
              <h3 className="font-semibold text-text-primary group-hover:text-primary leading-snug mb-2">
                {article.title}
              </h3>
              <time dateTime={article.date} className="text-xs text-text-secondary block mb-2">
                {new Date(article.date + "T12:00:00").toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" },
                )}
              </time>
              {article.excerpt && (
                <p className="text-sm text-text-secondary line-clamp-2">
                  {article.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
