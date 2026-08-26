import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /**
         * Primary brand green. Unit 1 shares this pair, which is why the
         * top bar looks continuous with the first unit's header.
         */
        brand: {
          DEFAULT: "#58cc02",
          dark: "#46a302",
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
        /** Divider rules between the nav chrome and page content. */
        divider: "#e5e5e5",
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
