import { type NextPage } from "next";
import { GlobeSvg } from "~/components/Svgs";
import { ButtonLink } from "~/components/Button";
import React from "react";
import { LanguageHeader } from "~/components/LanguageHeader";
import { useSetLoginScreenState } from "~/components/LoginScreen";
import _bgSnow from "../../public/bg-snow.svg";
import type { StaticImageData } from "next/image";
import { LanguageCarousel } from "~/components/LanguageCarousel";

const bgSnow = _bgSnow as StaticImageData;

const Home: NextPage = () => {
  const setLoginScreenState = useSetLoginScreenState();
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-marketing text-white"
      style={{ backgroundImage: `url(${bgSnow.src})` }}
    >
      <LanguageHeader />
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-16 md:flex-row md:gap-36">
        <GlobeSvg className="h-fit w-7/12 md:w-[360px]" />
        <div>
          <h1 className="mb-6 max-w-[600px] text-center text-3xl font-bold md:mb-12">
            The free, fun, and effective way to learn a language!
          </h1>
          <div className="mx-auto mt-4 flex w-fit flex-col items-center gap-3">
            {/*
              Bespoke padding: this column is `w-fit`, so below `md` the button's
              intrinsic width sets the column width. Keep px-10 or the CTA and the
              button under it stop lining up.
            */}
            <ButtonLink
              variant="primaryDeep"
              size="none"
              className="w-full px-10 py-3 text-center md:min-w-[320px]"
              href="/register"
            >
              Get started
            </ButtonLink>
            <button
              className="w-full rounded-2xl border-2 border-b-4 border-marketing-border bg-marketing px-8 py-3 font-bold uppercase transition hover:bg-marketing-hover md:min-w-[320px]"
              onClick={() => setLoginScreenState("LOGIN")}
            >
              I already have an account
            </button>
          </div>
        </div>
      </div>
      <LanguageCarousel />
    </main>
  );
};

export default Home;
