import { ExternalLink, ArrowRight } from "lucide-react";
import { Typography } from "../ui/Typography";

interface QuickLink {
  title: string;
  description?: string;
  icon?: string;
  url: string;
  isExternal?: boolean;
}

interface QuickLinksGridProps {
  title?: string;
  description?: string;
  links?: QuickLink[];
  columns?: number;
}

const QuickLinksGrid = ({
  title,
  description,
  links,
  columns = 3,
}: QuickLinksGridProps) => {
  const gridCols =
    {
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {(title || description) && (
          <div className="text-center mb-8 md:mb-12">
            {title && (
              <Typography variant="h2" center>
                {title}
              </Typography>
            )}
            {description && (
              <Typography
                variant="lead"
                color="secondary"
                center
                className="max-w-3xl mx-auto"
              >
                {description}
              </Typography>
            )}
          </div>
        )}

        {/* Links Grid */}
        <div className={`grid ${gridCols} gap-6 md:gap-8`}>
          {links?.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target={link.isExternal ? "_blank" : "_self"}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className="group block p-6 bg-bg-secondary shadow-sm rounded-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon */}
                {link.icon && (
                  <div className="flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full group-hover:bg-secondary/40 transition-colors">
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {link.icon}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Typography
                      variant="h5"
                      noMargin
                      className="group-hover:text-text-hover transition-colors"
                    >
                      {link.title}
                    </Typography>
                    {link.isExternal ? (
                      <ExternalLink
                        size={16}
                        className="group-hover:text-text-hover transition-colors"
                      />
                    ) : (
                      <ArrowRight
                        size={16}
                        className="group-hover:text-text-hover transition-colors group-hover:translate-x-1"
                      />
                    )}
                  </div>

                  {link.description && (
                    <Typography
                      variant="small"
                      color="secondary"
                      noMargin
                      className="line-clamp-2"
                    >
                      {link.description}
                    </Typography>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinksGrid;
