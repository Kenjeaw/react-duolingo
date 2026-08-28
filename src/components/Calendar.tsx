import dayjs from "dayjs";
import { useBoundStore } from "~/hooks/useBoundStore";
import { ChevronLeftSvg, ChevronRightSvg } from "./svgs/icons";
import { range } from "~/utils/array-utils";

const getCalendarDays = (now: dayjs.Dayjs): (number | null)[][] => {
  const startOfMonth = now.startOf("month");
  const calendarDays: (number | null)[][] = [];
  const firstWeekEndDate = 8 - startOfMonth.day();
  const firstWeek = [
    ...range(0, startOfMonth.day()).map(() => null),
    ...range(1, firstWeekEndDate),
  ];
  calendarDays.push(firstWeek);
  for (
    let weekStartDate = firstWeekEndDate;
    weekStartDate <= now.daysInMonth();
    weekStartDate += 7
  ) {
    calendarDays.push(
      range(weekStartDate, weekStartDate + 7).map((date) =>
        date <= now.daysInMonth() ? date : null,
      ),
    );
  }
  return calendarDays;
};

export const Calendar = ({
  now,
  setNow,
}: {
  /** The month on display. Callers hold this as client-only state. */
  now: dayjs.Dayjs;
  setNow: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
}) => {
  const isActiveDay = useBoundStore((x) => x.isActiveDay);
  const formattedNowMonth = now.format("MMMM YYYY");
  // Safe to read the clock during render: `now` comes from `useClientNow`, so
  // every caller has already gated this component behind a mounted, non-null
  // date and it never renders during the build's prerender. Keep it that way —
  // rendering a calendar from a server-side `dayjs()` bakes the build date into
  // the HTML. `now` is the month being browsed, which is not today once the
  // reader pages away, so the two cannot be collapsed into one value.
  const today = dayjs();
  const calendarDays = getCalendarDays(now);
  return (
    <article className="flex flex-col rounded-xl border-2 border-divider-strong p-3 text-gray-400">
      <header className="flex items-center justify-between gap-3">
        <button
          className="text-gray-400"
          onClick={() => setNow((now) => now?.add(-1, "month") ?? null)}
        >
          <ChevronLeftSvg />
          <span className="sr-only">Go to previous month</span>
        </button>
        <h3 className="text-lg font-bold uppercase text-gray-500">
          {formattedNowMonth}
        </h3>
        <button
          className="text-gray-400"
          onClick={() => setNow((now) => now?.add(1, "month") ?? null)}
        >
          <ChevronRightSvg />
          <span className="sr-only">Go to next month</span>
        </button>
      </header>
      <div className="flex justify-between px-3 py-2">
        {"SMTWTFS".split("").map((day, i) => {
          return (
            <div key={i} className="flex h-9 w-9 items-center justify-center">
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 px-3 py-2">
        {calendarDays.map((week, i) => {
          return (
            <div key={i} className="flex justify-between">
              {week.map((date, i) => {
                const isActiveDate =
                  date !== null && isActiveDay(now.date(date));
                const isCurrentDate =
                  date === today.date() &&
                  now.month() === today.month() &&
                  now.year() === today.year();
                return (
                  <div
                    key={i}
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      isActiveDate
                        ? "bg-orange-400 text-white"
                        : isCurrentDate
                          ? "bg-gray-300 text-gray-600"
                          : "",
                    ].join(" ")}
                  >
                    {date}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </article>
  );
};
