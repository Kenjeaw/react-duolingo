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
  let daysBack = 0;
  let day = dayjs();
  while (isActiveDay(activeDays, day)) {
    day = day.add(-1, "day");
    daysBack += 1;
  }
  return daysBack;
};

export type StreakSlice = {
  activeDays: ActiveDays;
  /**
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
