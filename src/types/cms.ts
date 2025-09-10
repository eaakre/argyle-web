export type CTA = {
  text: string;
  href: string;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  size?: "default" | "icon" | "sm" | "lg" | null | undefined;
};

export type Column = {
  image?: SanityImage;
  heading?: string;
  body?: string;
  cta?: CTA;
};

export type SanityImage = {
  asset: {
    _ref?: string;
    _type?: string;
  };
  _type?: string;
  _key?: string;
  alt?: string;
  url?: string;
};

export type InfoItemProps = {
  image?: SanityImage;
  heading: string;
  body: string;
  ctas?: CTA[];
  index?: number;
};

export type PageContentSlot =
  | {
      _type: "hero";
      _key: string;
      heading?: string;
      subheading?: string;
      backgroundType?: "image" | "video" | "color";
      backgroundImage?: SanityImage;
      backgroundVideoUrl?: string;
      backgroundColor?: string;
      fullWidth?: boolean;
      ctas?: CTA[];
      align?: "left" | "center" | "right";
    }
  | {
      _type: "gallery";
      _key: string;
      title?: string;
      images?: Array<{
        _key: string;
        asset: {
          _ref?: string;
          _type?: string;
        };
        alt?: string;
      }>;
    }
  | {
      _type: "textBlock";
      _key: string;
      title?: string;
      text?: string;
      image?: SanityImage;
      imagePosition?: "left" | "right";
      ctas?: CTA[];
    }
  | {
      _type: "twoColumn";
      _key: string;
      left?: Column;
      right?: Column;
    }
  | {
      _type: "infoGrid";
      _key: string;
      items?: InfoItemProps[];
    }
  | {
      _type: "googleMap";
      _key: string;
      address?: string;
      height?: number;
    }
  | {
      _type: string;
      _key: string;
      [key: string]: unknown;
    };
