import type { NextPage } from "next";
import React, { useState } from "react";
import { SettingsPageLayout } from "~/components/SettingsPageLayout";
import { CoachSvg } from "~/components/svgs/settings";
import { useBoundStore } from "~/hooks/useBoundStore";

const goalXpOptions = [
  { title: "Basic", xp: 1 },
  { title: "Casual", xp: 10 },
  { title: "Regular", xp: 20 },
  { title: "Serious", xp: 30 },
  { title: "Intense", xp: 50 },
] as const;

const Coach: NextPage = () => {
  const goalXp = useBoundStore((x) => x.goalXp);
  const setGoalXp = useBoundStore((x) => x.setGoalXp);

  const [localGoalXp, setLocalGoalXp] = useState(goalXp);
  return (
    <SettingsPageLayout
      title="Edit Daily Goal"
      onSave={() => setGoalXp(localGoalXp)}
      saveDisabled={localGoalXp === goalXp}
    >
      <p className="text-gray-400">
        Coach here! Selecting a daily goal will help you stay motivated while
        learning a language. You can change your goal at any time.
      </p>
      <div className="flex gap-5">
        <CoachSvg className="hidden h-52 w-52 sm:block" />
        <div className="grow">
          {goalXpOptions.map(({ title, xp }, i) => {
            return (
              <button
                key={title}
                className={[
                  "flex w-full items-center justify-between border-2 p-4 first:rounded-t-2xl last:rounded-b-2xl last:border-b-2",
                  xp === localGoalXp
                    ? "border-b-2 border-blue-400 bg-blue-100 text-blue-500"
                    : "border-t-0 border-gray-200 first:border-t-2 hover:bg-gray-100",
                  goalXpOptions[i + 1]?.xp === localGoalXp ? "border-b-0" : "",
                ].join(" ")}
                onClick={() => setLocalGoalXp(xp)}
              >
                <div className="font-bold">{title}</div>
                <div>{xp} XP per day</div>
              </button>
            );
          })}
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default Coach;
