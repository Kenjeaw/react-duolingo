import dayjs from "dayjs";
import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type UserSlice = {
  name: string;
  username: string;
  /**
   * When the reader signed in for the first time, or `null` before they have.
   *
   * Stamped on `logIn` rather than at store creation: the store is constructed
   * during the static prerender, so a `dayjs()` here would record the build
   * date and every reader would be told they joined the month the site was
   * last deployed.
   */
  joinedAt: dayjs.Dayjs | null;
  loggedIn: boolean;
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  logIn: () => void;
  logOut: () => void;
};

export const createUserSlice: BoundStateCreator<UserSlice> = (set) => ({
  name: "",
  username: "",
  joinedAt: null,
  loggedIn: false,
  setName: (name: string) => set(() => ({ name })),
  setUsername: (username: string) => set(() => ({ username })),
  logIn: () =>
    set((state) => ({
      loggedIn: true,
      // Only the first sign-in counts. Signing out and back in is not joining
      // again, and `logOut` leaves the rest of the profile in place too.
      joinedAt: state.joinedAt ?? dayjs(),
    })),
  logOut: () => set(() => ({ loggedIn: false })),
});
