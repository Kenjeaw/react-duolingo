import React from "react";
import { BottomBar } from "./BottomBar";
import { Button } from "./Button";
import { LeftBar } from "./LeftBar";
import { TopBar } from "./TopBar";
import type { SettingsTitle } from "./SettingsRightNav";
import { SettingsRightNav } from "./SettingsRightNav";

/**
 * The chrome shared by every page under `/settings`: the app nav, the heading
 * row with its save button, and the settings side nav.
 *
 * `title` drives both the heading and the highlighted entry in the side nav —
 * they are always the same string, so passing it once keeps them from drifting.
 *
 * Settings pages edit a local copy of their values and commit it on save, so
 * each page owns that state and hands back `onSave` and `saveDisabled`.
 */
export const SettingsPageLayout = ({
  title,
  onSave,
  saveDisabled,
  children,
}: {
  title: SettingsTitle;
  onSave: () => void;
  /** Typically "the local copy still matches the stored value". */
  saveDisabled: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <TopBar />
      <LeftBar selectedTab={null} />
      <BottomBar selectedTab={null} />
      <div className="mx-auto flex flex-col gap-5 px-4 py-20 sm:py-10 md:pl-28 lg:pl-72">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between lg:max-w-4xl">
          <h1 className="text-lg font-bold text-gray-800 sm:text-2xl">
            {title}
          </h1>
          <Button onClick={onSave} disabled={saveDisabled}>
            Save changes
          </Button>
        </div>
        <div className="flex justify-center gap-12">
          <div className="flex w-full max-w-xl flex-col gap-8">{children}</div>
          <SettingsRightNav selectedTab={title} />
        </div>
      </div>
    </div>
  );
};
