import dayjs from "dayjs";
import type { BoundStateCreator } from "~/hooks/useBoundStore";
import type { DateString } from "~/utils/dateString";
import { toDateString } from "~/utils/dateString";

type ActiveDays = Set<DateString>;

const addActiveDay = (activeDays: ActiveDays, day: dayjs.Dayjs): ActiveDays => {
  return new Set([...activeDays, toDateString(day)]);
};

const isActiveDay = (activeDays: ActiveDays, day: dayjs.Dayjs): boolean => {
  return activeDays.has(toDateString(day));
};

const getCurrentStreak = (activeDays: ActiveDays): number => {
  const today = dayjs();
  // Today extends a streak but cannot break one: a day the reader still has
  // time left in is not yet a missed day. So the walk starts at today only
  // once today is active, and at yesterday otherwise — which leaves a streak
  // standing all day and drops it at the midnight that ends an unused day.
  let day = isActiveDay(activeDays, today) ? today : today.add(-1, "day");
  let daysBack = 0;
  while (isActiveDay(activeDays, day)) {
    day = day.add(-1, "day");
    daysBack += 1;
  }
  return daysBack;
};

export type StreakSlice = {
  activeDays: ActiveDays;
  /**
   * Consecutive active days up to and including today, where today counts as
   * active-in-waiting: an unfinished today leaves the streak at its length
   * rather than zeroing it. See `getCurrentStreak`.
   *
   * Derived from `activeDays` on every read rather than stored, so a streak the
   * reader has already broken cannot keep showing its old length. A stored
   * number is only recomputed when a lesson ends, which leaves it wrong for
   * every render between midnight and the next completed lesson.
   */
  streak: () => number;
  isActiveDay: (day: dayjs.Dayjs) => boolean;
  addToday: () => void;
};

export const createStreakSlice: BoundStateCreator<StreakSlice> = (
  set,
  get,
) => ({
  activeDays: new Set(),
  streak: () => getCurrentStreak(get().activeDays),
  isActiveDay: (day: dayjs.Dayjs) => isActiveDay(get().activeDays, day),
  addToday: () => {
    set({ activeDays: addActiveDay(get().activeDays, dayjs()) });
  },
});
