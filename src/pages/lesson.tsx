import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BigCloseSvg, CloseSvg, DoneSvg } from "~/components/svgs/icons";
import {
  LessonFastForwardEndFailSvg,
  LessonFastForwardEndPassSvg,
  LessonFastForwardStartSvg,
  LessonTopBarEmptyHeart,
  LessonTopBarHeart,
} from "~/components/svgs/lesson";
import womanPng from "../../public/woman.png";
import { useBoundStore } from "~/hooks/useBoundStore";
import { useRouter } from "next/router";
import { Button, ButtonLink } from "~/components/Button";
import type {
  Select1Of3Problem,
  WriteInEnglishProblem,
} from "~/utils/lessonProblems";
import { lessonProblems, tilesToSentence } from "~/utils/lessonProblems";

const numbersEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((_, i) => a[i] === b[i]);
};

const formatTime = (timeMs: number): string => {
  const seconds = Math.floor(timeMs / 1000) % 60;
  const minutes = Math.floor(timeMs / 1000 / 60) % 60;
  const hours = Math.floor(timeMs / 1000 / 60 / 60);
  if (hours === 0)
    return [minutes, seconds]
      .map((x) => x.toString().padStart(2, "0"))
      .join(":");
  return [hours, minutes, seconds]
    .map((x) => x.toString().padStart(2, "0"))
    .join(":");
};

const Lesson: NextPage = () => {
  const router = useRouter();

  const [lessonProblem, setLessonProblem] = useState(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<null | number>(null);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [quitMessageShown, setQuitMessageShown] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const startTime = useRef(Date.now());
  const endTime = useRef(startTime.current + 1000 * 60 * 3 + 1000 * 33);

  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [reviewLessonShown, setReviewLessonShown] = useState(false);

  const problem = lessonProblems[lessonProblem] ?? lessonProblems[0];

  const totalCorrectAnswersNeeded = 2;

  const [isStartingLesson, setIsStartingLesson] = useState(true);
  const hearts =
    "fast-forward" in router.query &&
    !isNaN(Number(router.query["fast-forward"]))
      ? 3 - incorrectAnswerCount
      : null;

  const isAnswerCorrect =
    problem.type === "SELECT_1_OF_3"
      ? selectedAnswer === problem.correctAnswer
      : numbersEqual(selectedAnswers, problem.correctAnswer);

  const onCheckAnswer = () => {
    setCorrectAnswerShown(true);
    if (isAnswerCorrect) {
      setCorrectAnswerCount((x) => x + 1);
    } else {
      setIncorrectAnswerCount((x) => x + 1);
    }
    setQuestionResults((questionResults) => [
      ...questionResults,
      {
        question: problem.question,
        yourResponse:
          problem.type === "SELECT_1_OF_3"
            ? (problem.answers[selectedAnswer ?? 0]?.name ?? "")
            : tilesToSentence(problem.answerTiles, selectedAnswers),
        correctResponse:
          problem.type === "SELECT_1_OF_3"
            ? (problem.answers[problem.correctAnswer]?.name ?? "")
            : tilesToSentence(problem.answerTiles, problem.correctAnswer),
      },
    ]);
  };

  const onFinish = () => {
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setCorrectAnswerShown(false);
    setLessonProblem((x) => (x + 1) % lessonProblems.length);
    endTime.current = Date.now();
  };

  const onSkip = () => {
    setSelectedAnswer(null);
    setCorrectAnswerShown(true);
  };

  const unitNumber = Number(router.query["fast-forward"]);

  /**
   * Everything the lesson chrome needs, bundled so each problem component
   * takes its own data plus this, rather than a dozen pass-through props.
   */
  const flow: LessonFlow = {
    correctAnswerCount,
    totalCorrectAnswersNeeded,
    hearts,
    quitMessageShown,
    setQuitMessageShown,
    correctAnswerShown,
    isAnswerCorrect,
    onCheckAnswer,
    onFinish,
    onSkip,
  };

  if (hearts !== null && hearts < 0 && !correctAnswerShown) {
    return (
      <LessonFastForwardEndFail
        unitNumber={unitNumber}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    );
  }

  if (
    hearts !== null &&
    hearts >= 0 &&
    !correctAnswerShown &&
    correctAnswerCount >= totalCorrectAnswersNeeded
  ) {
    return (
      <LessonFastForwardEndPass
        unitNumber={unitNumber}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    );
  }

  if (hearts !== null && isStartingLesson) {
    return (
      <LessonFastForwardStart
        unitNumber={unitNumber}
        setIsStartingLesson={setIsStartingLesson}
      />
    );
  }

  if (correctAnswerCount >= totalCorrectAnswersNeeded && !correctAnswerShown) {
    return (
      <LessonComplete
        correctAnswerCount={correctAnswerCount}
        incorrectAnswerCount={incorrectAnswerCount}
        startTime={startTime}
        endTime={endTime}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    );
  }

  switch (problem.type) {
    case "SELECT_1_OF_3": {
      return (
        <ProblemSelect1Of3
          problem={problem}
          flow={flow}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
        />
      );
    }

    case "WRITE_IN_ENGLISH": {
      return (
        <ProblemWriteInEnglish
          problem={problem}
          flow={flow}
          selectedAnswers={selectedAnswers}
          setSelectedAnswers={setSelectedAnswers}
        />
      );
    }
  }
};

export default Lesson;

/**
 * The lesson-wide state and callbacks that every problem screen needs. The
 * lesson owns all of it; problem components only read it and pass it on.
 */
type LessonFlow = {
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  hearts: number | null;
  quitMessageShown: boolean;
  setQuitMessageShown: React.Dispatch<React.SetStateAction<boolean>>;
  correctAnswerShown: boolean;
  isAnswerCorrect: boolean;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
};

/**
 * The chrome around a single problem: progress bar and hearts at the top, the
 * check/continue footer and the quit sheet at the bottom. Problem components
 * supply only the body and the two things the footer cannot derive on its own.
 */
const LessonLayout = ({
  flow,
  correctAnswer,
  isAnswerSelected,
  sectionClassName = "",
  children,
}: {
  flow: LessonFlow;
  /** The solution to reveal when the answer was wrong. */
  correctAnswer: string;
  /** Whether the Check button should be enabled. */
  isAnswerSelected: boolean;
  /** Layout-only additions to the body section. */
  sectionClassName?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center gap-5">
        <div className="w-full max-w-5xl sm:mt-8 sm:px-5">
          <ProgressBar
            correctAnswerCount={flow.correctAnswerCount}
            totalCorrectAnswersNeeded={flow.totalCorrectAnswersNeeded}
            setQuitMessageShown={flow.setQuitMessageShown}
            hearts={flow.hearts}
          />
        </div>
        <section
          className={[
            "flex max-w-2xl grow flex-col gap-5 self-center sm:items-center sm:justify-center sm:gap-24",
            sectionClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </section>
      </div>

      <CheckAnswer
        correctAnswer={correctAnswer}
        correctAnswerShown={flow.correctAnswerShown}
        isAnswerCorrect={flow.isAnswerCorrect}
        isAnswerSelected={isAnswerSelected}
        onCheckAnswer={flow.onCheckAnswer}
        onFinish={flow.onFinish}
        onSkip={flow.onSkip}
      />

      <QuitMessage
        quitMessageShown={flow.quitMessageShown}
        setQuitMessageShown={flow.setQuitMessageShown}
      />
    </div>
  );
};

const ProgressBar = ({
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  setQuitMessageShown,
  hearts,
}: {
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  setQuitMessageShown: (isShown: boolean) => void;
  hearts: null | number;
}) => {
  return (
    <header className="flex items-center gap-4">
      {correctAnswerCount === 0 ? (
        <Link href="/learn" className="text-gray-400">
          <CloseSvg />
          <span className="sr-only">Exit lesson</span>
        </Link>
      ) : (
        <button
          className="text-gray-400"
          onClick={() => setQuitMessageShown(true)}
        >
          <CloseSvg />
          <span className="sr-only">Exit lesson</span>
        </button>
      )}
      <div
        className="h-4 grow rounded-full bg-gray-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={correctAnswerCount / totalCorrectAnswersNeeded}
      >
        <div
          className={
            "h-full rounded-full bg-green-500 transition-all duration-700 " +
            (correctAnswerCount > 0 ? "px-2 pt-1" : "")
          }
          style={{
            width: `${(correctAnswerCount / totalCorrectAnswersNeeded) * 100}%`,
          }}
        >
          <div className="h-[5px] w-full rounded-full bg-green-400"></div>
        </div>
      </div>
      {hearts !== null &&
        [1, 2, 3].map((heart) => {
          if (heart <= hearts) {
            return <LessonTopBarHeart key={heart} />;
          }
          return <LessonTopBarEmptyHeart key={heart} />;
        })}
    </header>
  );
};

const QuitMessage = ({
  quitMessageShown,
  setQuitMessageShown,
}: {
  quitMessageShown: boolean;
  setQuitMessageShown: (isShown: boolean) => void;
}) => {
  useEffect(() => {
    if (!quitMessageShown) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setQuitMessageShown(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [quitMessageShown, setQuitMessageShown]);

  return (
    <>
      <div
        className={
          quitMessageShown
            ? "fixed bottom-0 left-0 right-0 top-0 z-30 bg-black bg-opacity-60 transition-all duration-300"
            : "pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-30 bg-black bg-opacity-0 transition-all duration-300"
        }
        onClick={() => setQuitMessageShown(false)}
        aria-hidden={true}
      ></div>

      <article
        className={
          quitMessageShown
            ? "fixed bottom-0 left-0 right-0 z-40 flex flex-col gap-4 bg-white px-5 py-12 text-center transition-all duration-300 sm:flex-row"
            : "fixed -bottom-96 left-0 right-0 z-40 flex flex-col bg-white px-5 py-12 text-center transition-all duration-300 sm:flex-row"
        }
        aria-hidden={!quitMessageShown}
      >
        <div className="flex grow flex-col gap-4">
          <h2 className="text-lg font-bold sm:text-2xl">
            Are you sure you want to quit?
          </h2>
          <p className="text-gray-500 sm:text-lg">
            All progress for this lesson will be lost.
          </p>
        </div>
        <div className="flex grow flex-col items-center justify-center gap-4 sm:flex-row-reverse">
          <ButtonLink
            variant="info"
            fullWidth
            className="sm:w-48"
            href="/learn"
          >
            Quit
          </ButtonLink>
          <button
            className="w-full rounded-2xl py-3 font-bold uppercase text-blue-400 transition hover:brightness-90 sm:w-48 sm:border-2 sm:border-b-4 sm:border-gray-300 sm:text-gray-400 sm:hover:bg-gray-100"
            onClick={() => setQuitMessageShown(false)}
          >
            Stay
          </button>
        </div>
      </article>
    </>
  );
};

const CheckAnswer = ({
  isAnswerSelected,
  isAnswerCorrect,
  correctAnswerShown,
  correctAnswer,
  onCheckAnswer,
  onFinish,
  onSkip,
}: {
  isAnswerSelected: boolean;
  isAnswerCorrect: boolean;
  correctAnswerShown: boolean;
  correctAnswer: string;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
}) => {
  return (
    <>
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl sm:justify-between">
          <Button
            variant="secondary"
            size="block"
            className="hidden sm:block sm:min-w-[150px] sm:max-w-fit"
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            size="block"
            className="grow sm:min-w-[150px] sm:max-w-fit sm:grow-0"
            disabled={!isAnswerSelected}
            onClick={onCheckAnswer}
          >
            Check
          </Button>
        </div>
      </section>

      <div
        className={
          correctAnswerShown
            ? isAnswerCorrect
              ? "fixed bottom-0 left-0 right-0 bg-lime-100 font-bold text-green-600 transition-all"
              : "fixed bottom-0 left-0 right-0 bg-red-100 font-bold text-red-500 transition-all"
            : "fixed -bottom-52 left-0 right-0"
        }
      >
        <div className="flex max-w-5xl flex-col gap-4 p-5 sm:mx-auto sm:flex-row sm:items-center sm:justify-between sm:p-10 sm:py-14">
          <>
            {isAnswerCorrect ? (
              <div className="mb-2 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="hidden rounded-full bg-white p-5 text-green-500 sm:block">
                  <DoneSvg />
                </div>
                <div className="text-2xl">Good job!</div>
              </div>
            ) : (
              <div className="mb-2 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="hidden rounded-full bg-white p-5 text-red-500 sm:block">
                  <BigCloseSvg />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-2xl">Correct solution:</div>{" "}
                  <div className="text-sm font-normal">{correctAnswer}</div>
                </div>
              </div>
            )}
          </>
          <Button
            onClick={onFinish}
            variant={isAnswerCorrect ? "primary" : "danger"}
            size="block"
            className="w-full sm:min-w-[150px] sm:max-w-fit"
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

const ProblemSelect1Of3 = ({
  problem,
  flow,
  selectedAnswer,
  setSelectedAnswer,
}: {
  problem: Select1Of3Problem;
  flow: LessonFlow;
  selectedAnswer: number | null;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const { question, answers, correctAnswer } = problem;

  return (
    <LessonLayout
      flow={flow}
      correctAnswer={answers[correctAnswer]?.name ?? ""}
      isAnswerSelected={selectedAnswer !== null}
      sectionClassName="sm:px-5"
    >
      <h1 className="self-start text-2xl font-bold sm:text-3xl">{question}</h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup">
        {answers.map((answer, i) => {
          return (
            <div
              key={i}
              className={
                i === selectedAnswer
                  ? "cursor-pointer rounded-xl border-2 border-b-4 border-blue-300 bg-blue-100 p-4 text-blue-400"
                  : "cursor-pointer rounded-xl border-2 border-b-4 border-gray-200 p-4 hover:bg-gray-100"
              }
              role="radio"
              aria-checked={i === selectedAnswer}
              tabIndex={0}
              onClick={() => setSelectedAnswer(i)}
            >
              {answer.icon}
              <h2 className="text-center">{answer.name}</h2>
            </div>
          );
        })}
      </div>
    </LessonLayout>
  );
};

const ProblemWriteInEnglish = ({
  problem,
  flow,
  selectedAnswers,
  setSelectedAnswers,
}: {
  problem: WriteInEnglishProblem;
  flow: LessonFlow;
  selectedAnswers: number[];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const { question, correctAnswer, answerTiles } = problem;

  return (
    <LessonLayout
      flow={flow}
      correctAnswer={tilesToSentence(answerTiles, correctAnswer)}
      isAnswerSelected={selectedAnswers.length > 0}
    >
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
        Write this in English
      </h1>

      <div className="w-full">
        <div className="flex items-center gap-2 px-2">
          <Image src={womanPng} alt="" width={92} height={115} />
          <div className="relative ml-2 w-fit rounded-2xl border-2 border-gray-200 p-4">
            {question}
            <div
              className="absolute h-4 w-4 rotate-45 border-b-2 border-l-2 border-gray-200 bg-white"
              style={{
                top: "calc(50% - 8px)",
                left: "-10px",
              }}
            ></div>
          </div>
        </div>

        <div className="flex min-h-[60px] flex-wrap gap-1 border-b-2 border-t-2 border-gray-200 py-1">
          {selectedAnswers.map((i) => {
            return (
              <button
                key={i}
                className="rounded-2xl border-2 border-b-4 border-gray-200 p-2 text-gray-700"
                onClick={() => {
                  setSelectedAnswers((selectedAnswers) => {
                    return selectedAnswers.filter((x) => x !== i);
                  });
                }}
              >
                {answerTiles[i]}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {answerTiles.map((answerTile, i) => {
          return (
            <button
              key={i}
              className={
                selectedAnswers.includes(i)
                  ? "rounded-2xl border-2 border-b-4 border-gray-200 bg-gray-200 p-2 text-gray-200"
                  : "rounded-2xl border-2 border-b-4 border-gray-200 p-2 text-gray-700"
              }
              disabled={selectedAnswers.includes(i)}
              onClick={() =>
                setSelectedAnswers((selectedAnswers) => {
                  if (selectedAnswers.includes(i)) {
                    return selectedAnswers;
                  }
                  return [...selectedAnswers, i];
                })
              }
            >
              {answerTile}
            </button>
          );
        })}
      </div>
    </LessonLayout>
  );
};

/**
 * The footer every lesson end screen shares: review the scorecard, or continue
 * back to the learn path. `onContinue` is where each screen commits whatever
 * finishing the lesson earned.
 */
const LessonEndFooter = ({
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
  onContinue,
}: {
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
  onContinue?: () => void;
}) => {
  return (
    <>
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl sm:justify-between">
          <Button
            variant="secondary"
            size="block"
            className="hidden sm:block sm:min-w-[150px] sm:max-w-fit"
            onClick={() => setReviewLessonShown(true)}
          >
            Review lesson
          </Button>
          <ButtonLink
            variant="primary"
            size="block"
            fullWidth
            className="sm:min-w-[150px] sm:max-w-fit"
            href="/learn"
            onClick={onContinue}
          >
            Continue
          </ButtonLink>
        </div>
      </section>
      <ReviewLesson
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    </>
  );
};

const LessonComplete = ({
  correctAnswerCount,
  incorrectAnswerCount,
  startTime,
  endTime,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
}: {
  correctAnswerCount: number;
  incorrectAnswerCount: number;
  startTime: React.MutableRefObject<number>;
  endTime: React.MutableRefObject<number>;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
}) => {
  const router = useRouter();
  const isPractice = "practice" in router.query;

  const increaseXp = useBoundStore((x) => x.increaseXp);
  const addToday = useBoundStore((x) => x.addToday);
  const increaseLingots = useBoundStore((x) => x.increaseLingots);
  const increaseLessonsCompleted = useBoundStore(
    (x) => x.increaseLessonsCompleted,
  );
  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center justify-center gap-8 font-bold">
        <h1 className="text-center text-3xl text-yellow-400">
          Lesson Complete!
        </h1>
        <div className="flex flex-wrap justify-center gap-5">
          <div className="min-w-[110px] rounded-xl border-2 border-yellow-400 bg-yellow-400">
            <h2 className="py-1 text-center text-white">Total XP</h2>
            <div className="flex justify-center rounded-xl bg-white py-4 text-yellow-400">
              {correctAnswerCount}
            </div>
          </div>
          <div className="min-w-[110px] rounded-xl border-2 border-blue-400 bg-blue-400">
            <h2 className="py-1 text-center text-white">Committed</h2>
            <div className="flex justify-center rounded-xl bg-white py-4 text-blue-400">
              {formatTime(endTime.current - startTime.current)}
            </div>
          </div>
          <div className="min-w-[110px] rounded-xl border-2 border-green-400 bg-green-400">
            <h2 className="py-1 text-center text-white">Amazing</h2>
            <div className="flex justify-center rounded-xl bg-white py-4 text-green-400">
              {Math.round(
                (correctAnswerCount /
                  (correctAnswerCount + incorrectAnswerCount)) *
                  100,
              )}
              %
            </div>
          </div>
        </div>
      </div>
      <LessonEndFooter
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
        onContinue={() => {
          increaseXp(correctAnswerCount);
          addToday();
          increaseLingots(isPractice ? 0 : 1);
          if (!isPractice) {
            increaseLessonsCompleted();
          }
        }}
      />
    </div>
  );
};

type QuestionResult = {
  question: string;
  yourResponse: string;
  correctResponse: string;
};

const ReviewLesson = ({
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
}: {
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
}) => {
  const [selectedQuestionResult, setSelectedQuestionResult] =
    useState<null | QuestionResult>(null);
  return (
    <div
      className={[
        "fixed inset-0 flex items-center justify-center p-5 transition duration-300",
        reviewLessonShown ? "" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-black",
          reviewLessonShown ? "opacity-75" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setReviewLessonShown(false)}
      ></div>
      <div className="relative flex w-full max-w-4xl flex-col gap-5 rounded-2xl border-2 border-gray-200 bg-white p-8">
        <button
          className="absolute -right-5 -top-5 rounded-full border-2 border-gray-200 bg-gray-100 p-1 text-gray-400 hover:brightness-90"
          onClick={() => setReviewLessonShown(false)}
        >
          <BigCloseSvg className="h-8 w-8" />
          <span className="sr-only">Close</span>
        </button>
        <h2 className="text-center text-3xl">Check out your scorecard!</h2>
        <p className="text-center text-xl text-gray-400">
          Click the tiles below to reveal the solutions
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {questionResults.map((questionResult, i) => {
            return (
              <button
                key={i}
                className={[
                  "relative flex flex-col items-stretch gap-3 rounded-xl p-5 text-left",
                  questionResult.yourResponse === questionResult.correctResponse
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-500",
                ].join(" ")}
                onClick={() =>
                  setSelectedQuestionResult((selectedQuestionResult) =>
                    selectedQuestionResult === questionResult
                      ? null
                      : questionResult,
                  )
                }
              >
                <div className="flex justify-between gap-2">
                  <h3 className="font-bold">{questionResult.question}</h3>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
                    {questionResult.yourResponse ===
                    questionResult.correctResponse ? (
                      <DoneSvg className="h-5 w-5" />
                    ) : (
                      <BigCloseSvg className="h-5 w-5" />
                    )}
                  </div>
                </div>
                <div>{questionResult.yourResponse}</div>
                {selectedQuestionResult === questionResult && (
                  <div className="absolute left-1 right-1 top-20 z-10 rounded-2xl border-2 border-gray-200 bg-white p-3 text-sm tracking-tighter">
                    <div
                      className="absolute -top-2 h-3 w-3 rotate-45 border-l-2 border-t-2 border-gray-200 bg-white"
                      style={{ left: "calc(50% - 6px)" }}
                    ></div>
                    <div className="font-bold uppercase text-gray-400">
                      Your response:
                    </div>
                    <div className="mb-3 text-gray-700">
                      {questionResult.yourResponse}
                    </div>
                    <div className="font-bold uppercase text-gray-400">
                      Correct response:
                    </div>
                    <div className="text-gray-700">
                      {questionResult.correctResponse}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LessonFastForwardStart = ({
  unitNumber,
  setIsStartingLesson,
}: {
  unitNumber: number;
  setIsStartingLesson: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex min-h-screen flex-col px-5 py-8 text-center">
      <div className="flex grow flex-col items-center justify-center gap-5">
        <LessonFastForwardStartSvg />
        <h1 className="text-lg font-bold">
          Want to jump to Unit {unitNumber}?
        </h1>
        <p className="text-sm text-gray-400">
          {`Pass the test to jump ahead. We won't make it easy for you though.`}
        </p>
      </div>
      <div className="flex flex-col gap-5"></div>
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-5 sm:flex-row sm:justify-between">
          <Link
            href="/learn"
            className="font-bold uppercase text-blue-400 transition hover:brightness-110"
          >
            Maybe later
          </Link>
          <Button
            variant="info"
            size="block"
            className="w-full sm:min-w-[150px] sm:max-w-fit"
            onClick={() => setIsStartingLesson(false)}
          >
            {`Let's go`}
          </Button>
        </div>
      </section>
    </div>
  );
};

const LessonFastForwardEndFail = ({
  unitNumber,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
}: {
  unitNumber: number;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
}) => {
  return (
    <div className="flex min-h-screen flex-col px-5 py-8 text-center">
      <div className="flex grow flex-col items-center justify-center gap-5">
        <LessonFastForwardEndFailSvg />
        <h1 className="text-2xl font-bold">
          {`You didn't unlock Unit ${unitNumber}`}
        </h1>
        <p className="text-lg text-gray-500">
          {`Don't worry! Practice makes perfect.`}
        </p>
      </div>
      <LessonEndFooter
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    </div>
  );
};

const LessonFastForwardEndPass = ({
  unitNumber,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
}: {
  unitNumber: number;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
}) => {
  const jumpToUnit = useBoundStore((x) => x.jumpToUnit);
  return (
    <div className="flex min-h-screen flex-col px-5 py-8 text-center">
      <div className="flex grow flex-col items-center justify-center gap-5">
        <LessonFastForwardEndPassSvg />
        <h1 className="text-2xl font-bold">You unlocked Unit {unitNumber}!</h1>
        <p className="text-lg text-gray-500">
          Way to go! You’re making great strides!
        </p>
      </div>
      <LessonEndFooter
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
        onContinue={() => jumpToUnit(unitNumber)}
      />
    </div>
  );
};
