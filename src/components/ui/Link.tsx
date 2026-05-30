import NextLink from "next/link";
import { type ComponentProps } from "react";
import { buttonVariants, type ButtonVariantProps } from "./Button";
import { cn } from "@/lib/utils";

type StyledLinkProps = ComponentProps<typeof NextLink> & ButtonVariantProps;

export function StyledLink({ className, variant, size, ...props }: StyledLinkProps) {
  return (
    <NextLink
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
