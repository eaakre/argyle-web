import { Hero } from "@/components/blocks/hero";
import { Gallery } from "@/components/blocks/gallery";
import { TextBlock } from "@/components/blocks/textBlock";
import { PageContentSlot } from "@/types/cms";

type ContentSlotsRendererProps = {
  contentSlots: PageContentSlot[];
  className?: string;
};

export function ContentSlotsRenderer({
  contentSlots,
  className = "",
}: ContentSlotsRendererProps) {
  if (!contentSlots?.length) return null;

  return (
    <section className={className}>
      {contentSlots.map((slot: PageContentSlot, index: number) => {
        switch (slot._type) {
          case "hero":
            return <Hero key={index} {...slot} />;
          case "gallery":
            return <Gallery key={index} {...slot} />;
          case "textBlock":
            return <TextBlock key={index} {...slot} />;
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
