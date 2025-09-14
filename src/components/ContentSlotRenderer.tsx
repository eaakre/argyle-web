import { Hero } from "@/components/blocks/hero";
import { TextBlock } from "@/components/blocks/textBlock";
import { PageContentSlot } from "@/types/cms";
import EmblaGallery from "./blocks/emblaGallery";
import { GoogleMap } from "./blocks/google-map";
import QuickLinksGrid from "./blocks/quickLinksGrid";

type ContentSlotsRendererProps = {
  contentSlots: PageContentSlot[];
  className?: string;
  isHomepage?: boolean;
};

export function ContentSlotsRenderer({
  contentSlots,
  className = "",
  isHomepage = false,
}: ContentSlotsRendererProps) {
  if (!contentSlots?.length) return null;

  return (
    <section className={className}>
      {contentSlots.map((slot: PageContentSlot, index: number) => {
        switch (slot._type) {
          case "hero":
            return <Hero key={index} {...slot} isHomepage={isHomepage} />;
          case "quickLinksGrid":
            return <QuickLinksGrid key={index} {...slot} />;
          case "gallery":
            return <EmblaGallery key={index} {...slot} />;
          case "textBlock":
            return <TextBlock key={index} {...slot} />;
          case "googleMap":
            return <GoogleMap key={index} {...slot} />;

          default:
            return (
              <div key={index} className="border p-4 rounded">
                <p className="text-sm text-gray-500 mb-2">
                  Unknown component type: {slot._type}
                </p>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(slot, null, 2)}
                </pre>
              </div>
            );
        }
      })}
    </section>
  );
}
