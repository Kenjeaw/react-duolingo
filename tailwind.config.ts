import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /**
       * The two fixed bars, so the pages that have to leave room for them
       * cannot drift from the bars' real heights. `PageLayout` is the only
       * thing that should need these; the bars themselves set their own
       * height from the same token.
       */
      spacing: {
        /** TopBar. Mobile-only: the bar inside it is `sm:hidden`. */
        "top-bar": "58px",
        /** BottomBar: an 88px row plus its 2px top border. Hidden from `md`. */
        "bottom-bar": "90px",
      },
      colors: {
        /**
         * The app's one green. Every green surface is a step on this ramp:
         * primary CTAs, the lesson progress bar, correct-answer feedback,
         * and Unit 1 — which shares `DEFAULT`/`dark` with the top bar, and is
         * why the two look continuous. Do not reach for Tailwind's `green-*`
         * for anything that reads as the brand; add a step here instead.
         */
        brand: {
          /**
           * Sheen laid over `DEFAULT` — the highlight along the top of the
           * lesson progress bar. `DEFAULT` mixed 25% with white.
           */
          light: "#82d941",
          DEFAULT: "#58cc02",
          /** Bottom lip of a `DEFAULT` button. `DEFAULT` scaled to 80%. */
          dark: "#46a302",
          /**
           * Bottom lip of a `dark` button, which only the marketing pages'
           * deeper CTA needs. `dark` scaled to 80%, continuing the ramp.
           */
          darker: "#388202",
          /**
           * Pale wash behind correct-answer feedback, the counterpart to
           * `bg-red-100` on a wrong answer. `DEFAULT` mixed 85% with white.
           */
          tint: "#e6f7d9",
        },
        /**
         * Deep blue surface for the logged-out marketing pages
         * (`/` and `/register`) and the language header above them.
         */
        marketing: {
          DEFAULT: "#235390",
          hover: "#204b82",
          border: "#042c60",
          accent: "#0a4a82",
        },
        /** Selected tab in LeftBar / BottomBar. */
        selected: {
          DEFAULT: "#ddf4ff",
          border: "#84d8ff",
        },
        /**
         * Hairline borders. `DEFAULT` is the app's one border colour: nav
         * chrome, cards, outline buttons, section rules. `strong` is the
         * heavier edge that lifts a floating popover or dropdown off the
         * content it covers — reach for it only when the element floats.
         */
        divider: {
          DEFAULT: "#e5e5e5",
          strong: "#d1d5db",
        },
        /** Locked lesson tiles on the learn path. */
        locked: {
          DEFAULT: "#e5e5e5",
          border: "#b7b7b7",
        },
        /**
         * Per-unit accent pairs. Unit 1 uses `brand`; these cover units 2
         * and 3. Add a pair here before adding a unit to `utils/units.ts`.
         */
        unit: {
          purple: "#ce82ff",
          "purple-dark": "#a568cc",
          teal: "#00cd9c",
          "teal-dark": "#00a47d",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
