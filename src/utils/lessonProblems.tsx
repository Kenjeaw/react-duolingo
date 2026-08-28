import type { JSX } from "react";
import { AppleSvg, BoySvg, WomanSvg } from "~/components/svgs/lesson";

export type Select1Of3Answer = {
  icon: JSX.Element;
  name: string;
};

export type Select1Of3Problem = {
  type: "SELECT_1_OF_3";
  question: string;
  answers: readonly Select1Of3Answer[];
  /** Index into `answers`. */
  correctAnswer: number;
};

export type WriteInEnglishProblem = {
  type: "WRITE_IN_ENGLISH";
  question: string;
  answerTiles: readonly string[];
  /** Indices into `answerTiles`, in the order they spell the answer. */
  correctAnswer: readonly number[];
};

export type LessonProblem = Select1Of3Problem | WriteInEnglishProblem;

export type LessonProblemType = LessonProblem["type"];

/**
 * The problems a lesson cycles through.
 *
 * Typed as a non-empty tuple so `lessonProblems[0]` is always defined, which
 * gives the lesson a safe fallback without widening every other index.
 */
export const lessonProblems: readonly [LessonProblem, ...LessonProblem[]] = [
  {
    type: "SELECT_1_OF_3",
    question: `Which one of these is "the apple"?`,
    answers: [
      { icon: <AppleSvg />, name: "la manzana" },
      { icon: <BoySvg />, name: "el niño" },
      { icon: <WomanSvg />, name: "la mujer" },
    ],
    correctAnswer: 0,
  },
  {
    type: "WRITE_IN_ENGLISH",
    question: "El niño",
    answerTiles: ["woman", "milk", "water", "I", "The", "boy"],
    correctAnswer: [4, 5],
  },
];

/** Joins the tiles at `indices` into the sentence they spell out. */
export const tilesToSentence = (
  answerTiles: readonly string[],
  indices: readonly number[],
): string =>
  indices
    .map((i) => answerTiles[i])
    .filter((tile): tile is string => tile !== undefined)
    .join(" ");
