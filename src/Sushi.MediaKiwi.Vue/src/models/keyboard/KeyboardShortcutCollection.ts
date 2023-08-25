/**
 * Key binding interface.
 * Use + to combine keys. For example: control+f.
 * See link for options https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
 * @example
 * {
 *  "control+f": (e: KeyboardEvent) => {
 *    e.preventDefault();
 *  },
 * }
 */
export type KeyboardShortcutCollection = {
  [key: string]: (e: KeyboardEvent) => void;
};
