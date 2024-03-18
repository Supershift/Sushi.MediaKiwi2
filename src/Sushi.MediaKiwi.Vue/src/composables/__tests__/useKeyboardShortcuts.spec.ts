import "reflect-metadata";
import { describe, it, expect, vi } from "vitest";
import { useKeyboardShortcuts } from "../useKeyboardShortcuts";
import { KeyboardShortcutCollection } from "../../models/keyboard/KeyboardShortcutCollection";

// create the test bindings
const arrowBindings: KeyboardShortcutCollection = {
  ArrowLeft: (_e: KeyboardEvent) => {
    console.log("ArrowLeft tiggered");
  },
  ArrowRight: (_e: KeyboardEvent) => {
    console.log("ArrowRight tiggered");
  },
};

const controlBindings: KeyboardShortcutCollection = {
  "control+f": (_e: KeyboardEvent) => {
    console.log("control+f tiggered");
  },
};

const testShortcuts = {
  ...arrowBindings,
  ...controlBindings,
};

describe("useKeyboardShortcuts", () => {
  // inject dependencies
  const { addKeyboardShortcuts, removeKeyboardShortcuts, registerdKeyboardShortcuts, keysPressed, addKeyPressed, removeKeyPressed } = useKeyboardShortcuts();

  describe("Register keyboard shortcuts", () => {
    it("Should add keyboard shortcut", () => {
      // Add all bindings to the keyboard shortcuts
      addKeyboardShortcuts(testShortcuts);

      // Expect all bindings to be added to the keyboard shortcuts with lowercase keys
      expect(registerdKeyboardShortcuts.value).toContain({ arrowleft: testShortcuts.ArrowLeft });
      expect(registerdKeyboardShortcuts.value).toContain({ arrowright: testShortcuts.ArrowRight });
      expect(registerdKeyboardShortcuts.value).toContain({ "control+f": testShortcuts["control+f"] });

      removeKeyboardShortcuts(testShortcuts);
    });

    it("Should remove keyboard shortcut", () => {
      // Add all bindings to the keyboard shortcuts
      addKeyboardShortcuts(testShortcuts);

      // Remove the control+f binding from the keyboard shortcuts
      removeKeyboardShortcuts(controlBindings);

      // Expect the control+f binding to be removed from the keyboard shortcuts
      expect(registerdKeyboardShortcuts.value).toContain({ arrowleft: testShortcuts.ArrowLeft });
      expect(registerdKeyboardShortcuts.value).toContain({ arrowright: testShortcuts.ArrowRight });
      expect(registerdKeyboardShortcuts.value).not.toContain({ "control+f": testShortcuts["control+f"] });

      // Remove all bindings from the keyboard shortcuts
      removeKeyboardShortcuts(testShortcuts);
    });
  });

  describe("Registed keys pressed", () => {
    it("Should add keyPressed ", async () => {
      addKeyboardShortcuts(testShortcuts);

      // Add the keys pressed
      addKeyPressed({ key: "Control" } as KeyboardEvent);

      // Expect the keys to be added to the keys pressed set
      expect(keysPressed.value).toContain("control");

      removeKeyboardShortcuts(testShortcuts);
    });
    it("Should remove keyPressed ", async () => {
      addKeyboardShortcuts(testShortcuts);

      // Add the keys pressed
      addKeyPressed({ key: "Control" } as KeyboardEvent);

      // Expect the keys to be added to the keys pressed set
      expect(keysPressed.value).toContain("control");

      // Remove the key pressed
      removeKeyPressed({ key: "Control" } as KeyboardEvent);

      // Expect the keys to be removed from the keys pressed set
      expect(keysPressed.value).not.toContain("control");

      removeKeyboardShortcuts(testShortcuts);
    });
  });

  describe("Trigger keyboard shortcut events", () => {
    it("Should handle window multi-key keyboard event", async () => {
      addKeyboardShortcuts(testShortcuts);

      expect(keysPressed.value).not.toContain("control");
      expect(keysPressed.value).not.toContain("f");

      // Create a spy on the control+f function
      // This is in lowercase because the keys are normalized to lowercase
      const spy = vi.spyOn(registerdKeyboardShortcuts.value!, "control+f");

      // Dispatch the keydown event with Arrow Left
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Control" }));

      // Expect the control+f function NOT to be called
      expect(spy).not.toHaveBeenCalled();

      // Dispatch the keydown event with f
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "f" }));

      // Now Expect the control+f function to be called
      expect(spy).toHaveBeenCalled();

      // Dispatch the keyup event with f
      window.dispatchEvent(new KeyboardEvent("keyup", { key: "f" }));
      window.dispatchEvent(new KeyboardEvent("keyup", { key: "Control" }));

      expect(keysPressed.value).not.toContain("control");
      expect(keysPressed.value).not.toContain("f");

      removeKeyboardShortcuts(testShortcuts);
    });
  });
});
