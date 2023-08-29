import { ref } from "vue";
import { KeyboardShortcutCollection } from "@/models/keyboard/KeyboardShortcutCollection";

// Define variables
/**
 * Registered key shortcuts. This is a collection of key shortcuts that are registered.
 * @type { KeyboardShortcutCollection }
 */
const registerdKeyboardShortcuts = ref<KeyboardShortcutCollection>();

/**
 * Keys pressed. This is a set of keys that are currently pressed.
 * @type { Set<string> }
 */
const keysPressed = ref(new Set());

/**
 * Handle key shortcuts.
 * This function is called when a key is pressed.
 * It will check if the key combination is registered in the key shortcuts.
 * If so, it will call the function that is registered for that key combination.
 * If not, it will do nothing.
 * @param { KeyboardEvent } e Keyboard event.
 */
function handleKeyboardShortcuts(e: KeyboardEvent) {
  const keys = Array.from(keysPressed.value).join("+");
  if (registerdKeyboardShortcuts.value && registerdKeyboardShortcuts.value[keys]) {
    registerdKeyboardShortcuts.value[keys](e);
    clearKeysPressed();
  }
}

/**
 * Normalize key shortcuts.
 * This function will normalize the key shortcuts.
 * It will convert all keys to lowercase.
 * @param {KeyboardShortcutCollection} shortcuts Key shortcuts.
 * @returns
 */
function normalizeKeyboardShortcuts(shortcuts: KeyboardShortcutCollection) {
  return Object.assign(
    {},
    ...Object.keys(shortcuts).map((key) => {
      return { [key.toLowerCase()]: shortcuts[key] };
    })
  );
}

/**
 * Add key shortcuts.
 * This function will add key shortcuts.
 * It will normalize the key shortcuts.
 * It will merge the key shortcuts with the existing key shortcuts.
 * It will overwrite existing key shortcuts.
 * Use + to combine keys. For example: control+f
 * @param {KeyboardShortcutCollection} shortcuts Key shortcuts.
 */
function addKeyboardShortcuts(shortcuts: KeyboardShortcutCollection) {
  const normalizedshortcuts = normalizeKeyboardShortcuts(shortcuts);
  registerdKeyboardShortcuts.value = { ...normalizedshortcuts };
}

/**
 * Remove key shortcuts.
 * This function will remove key shortcuts.
 * It will normalize the key shortcuts.
 * It will delete the key shortcuts from the existing key shortcuts.
 * @param {KeyboardShortcutCollection} shortcuts Key shortcuts.
 */
function removeKeyboardShortcuts(shortcuts: KeyboardShortcutCollection) {
  if (registerdKeyboardShortcuts.value) {
    const normalizedshortcuts = normalizeKeyboardShortcuts(shortcuts);
    for (const key in normalizedshortcuts) {
      delete registerdKeyboardShortcuts.value[key];
    }
  }
}

/**
 * This function will add the key to the keys pressed set.
 * It will call the handleKeyboardShortcuts function.
 */
function addKeyPressed(e: KeyboardEvent) {
  keysPressed.value.add(e.key.toLowerCase());
  handleKeyboardShortcuts(e);
}

/**
 * This function will remove the key from the keys pressed set.
 */
function removeKeyPressed(e: KeyboardEvent) {
  keysPressed.value.delete(e.key.toLowerCase());
}

/**
 * This function will clear the keys pressed set.
 */
function clearKeysPressed() {
  keysPressed.value.clear();
}

/**
 * Add an event listener for the keydown event.
 * This function will be called when a key is pressed.
 * Trigger the addKeyPressed function.
 */
window.addEventListener("keydown", addKeyPressed);

/**
 * Add an event listener for the keyup event.
 * This function will be called when a key is released.
 * Trigger the removeKeyPressed function.
 */
window.addEventListener("keyup", removeKeyPressed);

/**
 * Use keyboard shortcuts composable.
 * This function will return the addKeyboardShortcuts and removeKeyboardShortcuts functions.
 * These functions can be used to add and remove key shortcuts.
 * See link for options https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
 * @returns { addKeyboardShortcuts, removeKeyboardShortcuts, keysPressed, registerdKeyboardShortcuts }
 */
export function useKeyboardShortcuts() {
  return {
    addKeyboardShortcuts,
    removeKeyboardShortcuts,
    keysPressed,
    registerdKeyboardShortcuts,
    addKeyPressed,
    removeKeyPressed,
  };
}
