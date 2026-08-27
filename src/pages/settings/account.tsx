import type { NextPage } from "next";
import React, { useState } from "react";
import { SettingsPageLayout } from "~/components/SettingsPageLayout";
import { useBoundStore } from "~/hooks/useBoundStore";

const Account: NextPage = () => {
  const name = useBoundStore((x) => x.name);
  const setName = useBoundStore((x) => x.setName);
  const [localName, setLocalName] = useState(name);

  const username = useBoundStore((x) => x.username);
  const setUsername = useBoundStore((x) => x.setUsername);
  const [localUsername, setLocalUsername] = useState(username);

  const accountOptions = [
    { title: "Name", value: localName, setValue: setLocalName },
    { title: "Username", value: localUsername, setValue: setLocalUsername },
  ];

  return (
    <SettingsPageLayout
      title="Account"
      onSave={() => {
        setName(localName);
        setUsername(localUsername);
      }}
      saveDisabled={name === localName && username === localUsername}
    >
      {accountOptions.map(({ title, value, setValue }) => {
        return (
          <label
            key={title}
            className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:pl-10"
          >
            <div className="font-bold sm:w-1/6">{title}</div>
            <input
              className="grow rounded-2xl border-2 border-divider p-4 py-2"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
        );
      })}
    </SettingsPageLayout>
  );
};

export default Account;
