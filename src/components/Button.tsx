import Link from "next/link";
import type { ComponentProps } from "react";
import React from "react";

/**
 * The app's call-to-action buttons.
 *
 * Every CTA in the app is one of these five variants. Before adding a variant,
 * check whether an existing one plus a layout-only `className` covers the case —
 * the point of this component is that there is exactly one definition of what a
 * green button looks like.
 *
 * `className` must not carry a utility that competes with one the variant or
 * size already sets — no colour, no border, no padding, no rounding. Tailwind
 * resolves conflicting utilities by stylesheet order, not by the order they
 * appear in the attribute, so an override there wins or loses unpredictably.
 * Utilities on properties no variant touches (width, display, gap, breakpoint
 * visibility, font size) are fine, and `size="none"` frees up padding for a
 * call site that genuinely needs its own. If a call site needs different
 * colours, it needs a variant.
 */
export type ButtonVariant =
  | "primary"
  | "primaryDeep"
  | "info"
  | "danger"
  | "secondary"
  | "secondaryAccent"
  | "secondaryDanger"
  | "onBlue"
  | "marketing";

/**
 * `block` is the square padding the lesson footer buttons use; `sm` and `md`
 * are the compact and default sizes elsewhere.
 *
 * `none` emits no padding at all, so a call site with genuinely bespoke padding
 * can supply its own through `className` without two padding utilities fighting
 * over stylesheet order. Reach for it only when no size fits — if you find
 * yourself using it repeatedly, the shape you keep rewriting wants a size.
 */
export type ButtonSize = "sm" | "md" | "block" | "none";

const baseClass = "rounded-2xl font-bold uppercase transition";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-b-4 border-brand-dark bg-brand text-white hover:brightness-110",
  /** Deeper green for the marketing pages, which sit on `bg-marketing`. */
  primaryDeep:
    "border-b-4 border-brand-darker bg-brand-dark text-white hover:brightness-110",
  info: "border-b-4 border-blue-500 bg-blue-400 text-white hover:brightness-110",
  danger:
    "border-b-4 border-red-600 bg-red-500 text-white hover:brightness-110",
  secondary:
    "border-2 border-b-4 border-divider bg-white text-gray-400 hover:bg-gray-50 hover:brightness-90",
  /** Outline button whose label is the accent blue rather than grey. */
  secondaryAccent:
    "border-2 border-b-4 border-divider bg-white text-blue-400 hover:bg-gray-50 hover:brightness-90",
  /** Outline button whose label is red — a price, or a destructive action. */
  secondaryDanger:
    "border-2 border-b-4 border-divider bg-white text-red-500 hover:bg-gray-50 hover:brightness-90",
  /**
   * White button for a coloured header bar. Its lip and label are tuned to
   * the `bg-blue-400` header on `/forgot-password`, its only call site — check
   * the contrast against the surface before reusing it elsewhere.
   */
  onBlue:
    "border-b-4 border-blue-300 bg-white text-blue-800 hover:brightness-110",
  /**
   * Reads as an outline button against `bg-marketing`, which it shares a fill
   * with. Pairs with `primaryDeep` as the secondary CTA on the landing page.
   */
  marketing:
    "border-2 border-b-4 border-marketing-border bg-marketing text-white hover:bg-marketing-hover",
};

/** Applied to <button> only; an <a> cannot be disabled. */
const disabledClass =
  "disabled:border-b-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 disabled:hover:brightness-100";

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-4 py-2",
  md: "px-5 py-3",
  block: "p-3",
  none: "",
};

const fullWidthClass = "flex w-full items-center justify-center";

type StyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the container and centre the label. */
  fullWidth?: boolean;
  className?: string;
};

const buildClassName = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  includeDisabled,
}: StyleProps & { includeDisabled: boolean }) =>
  [
    baseClass,
    variantClass[variant],
    sizeClass[size],
    includeDisabled ? disabledClass : "",
    fullWidth ? fullWidthClass : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

export const Button = ({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: StyleProps & ComponentProps<"button">) => (
  <button
    type={type}
    className={buildClassName({
      variant,
      size,
      fullWidth,
      className,
      includeDisabled: true,
    })}
    {...props}
  />
);

/**
 * Navigation styled as a CTA. Use this rather than wrapping a `Button` in a
 * `Link`, which nests an interactive element inside another one.
 */
export const ButtonLink = ({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: StyleProps & ComponentProps<typeof Link>) => (
  <Link
    className={buildClassName({
      variant,
      size,
      fullWidth,
      className,
      includeDisabled: false,
    })}
    {...props}
  />
);
