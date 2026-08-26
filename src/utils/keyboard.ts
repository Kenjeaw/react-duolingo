import type { KeyboardEvent } from "react";

/**
 * Enter/Space activation for a div that carries role="button".
 *
 * Prefer a real <button>. This is for the few triggers that must stay divs
 * because they wrap their own popup, and a <button> may not contain the links
 * and buttons inside it. The target check keeps a Space press on one of those
 * nested controls from bubbling up and toggling the popup shut.
 */
export const onEnterOrSpace =
  <T extends HTMLElement>(activate: () => void) =>
  (event: KeyboardEvent<T>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    activate();
  };
