/**
 * Rules of the game that more than one screen has to agree on.
 *
 * Each of these was previously written out as a bare number in several places,
 * where changing one and missing another silently desynchronises the UI.
 */

/**
 * Lessons that count towards completing a single tile on the learn path.
 *
 * Used to derive tile status from `lessonsCompleted`, to work out how far a
 * fast-forward jump advances, and as the reward for opening a treasure tile.
 */
export const lessonsPerTile = 4;

/**
 * Lessons that must be completed before the leaderboard unlocks. Both the
 * leaderboard page and the right rail's "Unlock Leaderboards!" card count
 * against this, and they have to tell the reader the same thing.
 */
export const lessonsToUnlockLeaderboard = 10;

/** Correct answers required to finish a lesson. */
export const correctAnswersPerLesson = 2;

/**
 * Hearts a fast-forward test starts with. Each wrong answer costs one, and the
 * test fails when the last one goes, so this is also the number of mistakes
 * that ends it. The progress bar draws exactly this many hearts, so the count
 * and the drawing share it.
 */
export const heartsPerFastForwardTest = 3;
