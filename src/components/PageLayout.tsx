import React from "react";
import { BottomBar } from "./BottomBar";
import { LeftBar } from "./LeftBar";
import { TopBar } from "./TopBar";
import type { Tab } from "./BottomBar";

/**
 * Written out in full rather than composed, because Tailwind finds class names
 * by scanning the source text and never sees a string built at runtime.
 */
const topOffsetClass = {
  sm: "pt-top-bar sm:p-6 sm:pt-10",
  md: "pt-top-bar sm:p-6 sm:pt-top-bar md:pt-10",
} as const;

/**
 * The chrome every signed-in page shares: the three nav bars, the offsets that
 * keep content clear of them, and the content row.
 *
 * Each page used to spell this out itself, and the four copies had drifted —
 * different breakpoints for the same padding, three different ways of leaving
 * room for the bottom bar, and one page reserving space for a top bar it never
 * rendered. The offsets belong to the bars, not to the pages, so they live here.
 *
 * `children` is the main column and sizes itself (`max-w-*`) and its own
 * gutters, which are content-specific — the learn path is deliberately
 * full-bleed on mobile where the other pages are not.
 */
export const PageLayout = ({
  selectedTab,
  topBar,
  topBarUntil = "sm",
  rightColumn,
  children,
}: {
  /** Highlighted entry in LeftBar and BottomBar. `null` outside the four tabs. */
  selectedTab: Tab | null;
  /**
   * Overrides the standard bar — `/learn` tints it to match the unit in view,
   * and `/profile` swaps in its own title-and-settings bar.
   */
  topBar?: React.ReactNode;
  /**
   * The last breakpoint at which the top bar is still on screen, so the shell
   * reserves room for exactly as long as the bar is there. `TopBar` hands the
   * streak and gems over to `RightBar` at `sm`, so `sm` is the default;
   * `/profile` has no right rail and its bar is the only way to reach settings
   * until `LeftBar` appears, so its bar — and this offset — run to `md`.
   */
  topBarUntil?: "sm" | "md";
  /** The right rail, when the page has one. Sits beside `children`. */
  rightColumn?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div>
      {topBar ?? <TopBar />}
      <LeftBar selectedTab={selectedTab} />
      <div
        className={[
          "flex justify-center gap-3 md:ml-24 lg:ml-64 lg:gap-12",
          topOffsetClass[topBarUntil],
        ].join(" ")}
      >
        {children}
        {rightColumn}
      </div>
      {/* Clearance for the fixed BottomBar, which only exists below `md`. */}
      <div className="pt-bottom-bar md:hidden"></div>
      <BottomBar selectedTab={selectedTab} />
    </div>
  );
};
