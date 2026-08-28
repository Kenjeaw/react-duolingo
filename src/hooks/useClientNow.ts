import type dayjs from "dayjs";
import { useState } from "react";

/**
 * The date a calendar is browsing — `null` until something stamps it.
 *
 * Every page here is statically prerendered, so a `dayjs()` evaluated while
 * rendering runs *once, at build time*, and that answer is baked into the HTML
 * every visitor is served from then on: a calendar frozen on the build month,
 * highlighting the build date. It also mismatches on hydration as soon as the
 * real date moves past the build, because the server and client no longer agree
 * on what day it is. So this deliberately has no default — any default it could
 * pick would be the build's.
 *
 * Holders stamp it with `dayjs()` from the handler that reveals the calendar,
 * and render nothing until then. That handler is a click or a hover, which only
 * ever runs in a browser, so the clock is never read during the prerender.
 * Note the popups holding these calendars stay mounted and are hidden in CSS —
 * "it is not visible yet" is not the same as "it has not rendered yet", which
 * is how the build date got baked in to begin with.
 */
export const useClientNow = () => useState<dayjs.Dayjs | null>(null);
