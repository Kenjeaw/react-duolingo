import type { NextPage } from "next";
import React from "react";

import { BottomBar } from "~/components/BottomBar";
import { Button } from "~/components/Button";
import { LeftBar } from "~/components/LeftBar";
import { RightBar } from "~/components/RightBar";
import { TopBar } from "~/components/TopBar";
import { EmptyGemSvg } from "~/components/svgs/status";
import {
  DoubleOrNothingSvg,
  DuoPlushieSvg,
  StreakFreezeSvg,
} from "~/components/svgs/shop";

const Shop: NextPage = () => {
  const streakFreezes = 0;

  return (
    <div>
      <TopBar />
      <LeftBar selectedTab="Shop" />
      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="px-4 pb-20">
          <h1 className="sr-only">Shop</h1>
          <div className="py-7">
            <h2 className="mb-5 text-2xl font-bold">Power-ups</h2>
            <div className="flex border-t-2 border-divider py-5">
              <StreakFreezeSvg className="shrink-0" />
              <section className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">Streak Freeze</h3>
                <p className="text-sm text-gray-500">
                  Streak Freeze allows your streak to remain in place for one
                  full day of inactivity.
                </p>
                <div className="w-fit rounded-full bg-gray-200 px-3 py-1 text-sm font-bold uppercase text-gray-400">
                  {streakFreezes} / 2 equipped
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex w-fit items-center gap-1 text-sm"
                  disabled
                >
                  Get one for: <EmptyGemSvg /> 10
                </Button>
              </section>
            </div>
            <div className="flex border-t-2 border-divider py-5">
              <DoubleOrNothingSvg className="shrink-0" />
              <section className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">Double or Nothing</h3>
                <p className="text-sm text-gray-500">
                  Attempt to double your five lingot wager by maintaining a
                  seven day streak.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex w-fit items-center gap-1 text-sm"
                  disabled
                >
                  Get for: <EmptyGemSvg /> 5
                </Button>
              </section>
            </div>
          </div>
          <div className="py-7">
            <h2 className="mb-5 text-2xl font-bold">Merch</h2>
            <div className="flex border-t-2 border-divider py-5">
              <DuoPlushieSvg className="h-32 w-32 shrink-0 p-4" />
              <section className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">Duo Plushie</h3>
                <p className="text-sm text-gray-500">
                  {`Celebrate Duolingo's 10 year anniversary with a new exclusive Duo plushie!`}
                </p>
                <Button
                  variant="secondaryDanger"
                  size="none"
                  className="flex w-fit items-center gap-1 px-4 py-3 text-sm"
                >
                  $29.99
                </Button>
              </section>
            </div>
          </div>
        </div>
        <RightBar />
      </div>
      <BottomBar selectedTab="Shop" />
    </div>
  );
};

export default Shop;
