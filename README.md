# React Duolingo

A [Duolingo](https://www.duolingo.com) clone built as a front-end-only web app: the whole learning
experience — the unit path, lessons, XP, streaks, the leaderboard, the shop — runs in the browser
against an in-memory store, with no backend, no database, and no accounts.

<img src="./screenshots/screenshot-mobile.png" alt="Mobile screenshot" />
<img src="./screenshots/screenshot-desktop.png" alt="Desktop screenshot" />

## Stack

| | |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (Pages Router) |
| UI | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config, no `tailwind.config`) |
| State | [Zustand](https://github.com/pmndrs/zustand) — one bound store built from slices |
| Dates | [dayjs](https://day.js.org/) |
| Env validation | [`@t3-oss/env-nextjs`](https://env.t3.gg/) + [Zod](https://zod.dev/) |

Scaffolded with [create-t3-app](https://github.com/t3-oss/create-t3-app).

## Getting started

Requires Node 20+ (developed on Node 24). Any of npm, pnpm, or bun works — lockfiles for
pnpm and bun are committed.

```bash
git clone https://github.com/Kenjeaw/react-duolingo.git
cd react-duolingo
pnpm install
cp .env.example .env
pnpm dev
```

Then open http://localhost:3000.

There are no secrets to fill in — `.env` only needs to exist so the schema in
[`src/env.mjs`](src/env.mjs) can validate `NODE_ENV`. To skip validation entirely (Docker builds,
CI), set `SKIP_ENV_VALIDATION=1`.

### Scripts

| Script | Does |
| --- | --- |
| `pnpm dev` | Start the dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint across the repo |

## What's in it

- **Learn path** — units of tiles (lesson stars, books, treasure chests, trophies, and
  fast-forward tests) that unlock as lessons are completed.
- **Lessons** — two problem types, `SELECT_1_OF_3` and `WRITE_IN_ENGLISH`, cycling until you get
  enough correct answers, followed by an XP/time/accuracy summary.
- **Fast-forward tests** — jump ahead a unit, with hearts that run out on wrong answers.
- **Streaks** — a calendar of active days, with the current streak derived on every read so a
  broken streak can't linger.
- **Leaderboard** — your weekly XP ranked against a fixed cast of fake users; unlocks after
  enough lessons.
- **Shop, profile, settings** — lingot balance, daily XP goal, sound settings, and a mock
  login/register flow that just sets a name.

## Project layout

```
src/
  components/     Shared UI — the three bars (top/left/bottom/right), layouts, and SVGs
  hooks/          useBoundStore, useLeaderboard, useClientNow
  pages/          Pages Router routes: learn, lesson, leaderboard, shop, profile, settings/*
  stores/         Zustand slices: xp, goalXp, streak, lingot, lesson, language, user, sound
  utils/          Units and lesson content, languages, fake users, date and array helpers
```

### State

Every slice is composed into a single store in
[`src/hooks/useBoundStore.ts`](src/hooks/useBoundStore.ts), so components read one hook and slices
can call across to each other. State lives only for the session — reloading the page resets
progress.

Values that more than one screen has to agree on (lessons per tile, correct answers per lesson,
hearts per test, lessons needed to unlock the leaderboard) live in
[`src/utils/constants.ts`](src/utils/constants.ts) rather than being repeated inline.

### Content

Lesson and course content is static data, not a CMS:
[`src/utils/units.ts`](src/utils/units.ts) defines the path,
[`src/utils/lessonProblems.tsx`](src/utils/lessonProblems.tsx) defines the problems, and
[`src/utils/fakeUsers.ts`](src/utils/fakeUsers.ts) populates the leaderboard.

## License

[MIT](LICENSE). This is an unofficial fan project for learning purposes and is not affiliated with
or endorsed by Duolingo; Duolingo's name, characters, and branding belong to Duolingo, Inc.
Originally created by [Bryan Jennings](https://github.com/bryanjenningz/react-duolingo).
