import { cn } from "@/lib/utils";
import { ElementType, HTMLAttributes } from "react";

interface TypographyProps extends HTMLAttributes<HTMLDivElement> {
  variant?:
    | "h1"
    | "h2"
    | "h3" 
    | "h4"
    | "p"
    | "blockquote"
    | "ul"
    | "inline"
    | "lead"
    | "large"
    | "small"
    | "muted"
    | "body";
  as?: ElementType;
}

const variants = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  ul: "my-6 ml-6 list-disc [&>li]:mt-2",
  inline: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  body: "text-sm font-normal",
} as const;

export const Typography = ({
  children,
  variant = "body",
  className,
  as,
  ...props
}: TypographyProps) => {
  const Component = as || 'div';
  
  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
};
