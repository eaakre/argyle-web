import { ReactNode, HTMLAttributes, ElementType } from "react";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "lead"
  | "large"
  | "small"
  | "muted"
  | "blockquote"
  | "code"
  | "footer-header"
  | "footer-text";

type ColorVariant =
  | "default"
  | "secondary"
  | "accent"
  | "muted"
  | "background"
  | "background-secondary";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
  as?: ElementType;
  color?: ColorVariant;
  center?: boolean;
  noMargin?: boolean;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "text-4xl md:text-5xl font-bold leading-tight mb-4",
  h2: "text-3xl md:text-4xl font-semibold leading-tight mb-3",
  h3: "text-2xl md:text-3xl font-semibold leading-snug mb-3",
  h4: "text-xl md:text-2xl font-semibold leading-snug mb-2",
  h5: "text-lg md:text-xl font-medium leading-normal mb-2",
  h6: "text-base md:text-lg font-medium leading-normal mb-2",
  p: "text-base leading-relaxed mb-4",
  lead: "text-lg md:text-xl leading-relaxed mb-4",
  large: "text-lg font-medium",
  small: "text-sm",
  muted: "text-sm",
  blockquote: "text-lg italic border-l-4 border-primary pl-4 my-4",
  code: "bg-secondary text-secondary-foreground px-1 py-0.5 rounded text-sm font-mono",
  "footer-header":
    "text-lg font-semibold leading-normal text-footer-text-secondary",
  "footer-text": "text-sm leading-relaxed text-footer-text",
};

const colorStyles: Record<ColorVariant, string> = {
  default: "text-text-primary",
  secondary: "text-text-secondary",
  accent: "text-accent",
  muted: "text-text-hover",
  background: "text-bg-primary",
  "background-secondary": "text-bg-secondary",
};

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
  blockquote: "blockquote",
  code: "code",
  "footer-header": "h4",
  "footer-text": "span",
};

export function Typography({
  variant,
  children,
  className = "",
  as,
  color = "default",
  center = false,
  noMargin = false,
  ...props
}: TypographyProps) {
  const Element = as || defaultElements[variant];

  // Don't apply color styles to footer variants since they have their own colors built in
  const shouldApplyColorStyles = !variant.startsWith("footer-");

  const classes = [
    variantStyles[variant],
    shouldApplyColorStyles && colorStyles[color],
    center && "text-center",
    noMargin && "!mb-0",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Element className={classes} {...props}>
      {children}
    </Element>
  );
}
