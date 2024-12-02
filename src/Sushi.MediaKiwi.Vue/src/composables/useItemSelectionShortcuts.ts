import { isBuffer } from "cypress/types/lodash";
import { ComponentPublicInstance, CreateComponentPublicInstance, onMounted, onUnmounted, ref, ShallowRef } from "vue";

type itemSelectionShortcutsParams<T> = {
  dataItem: T;
};

type useItemSelectionShortcutsProps<T> = {
  element?: ShallowRef<any>;
  onCtrlA?: () => void | Promise<void>;
  onShiftClick?: (args: itemSelectionShortcutsParams<T>) => void | Promise<void>;
  onCtrlClick?: (args: itemSelectionShortcutsParams<T>) => void | Promise<void>;
};

export function useItemSelectionShortcuts<T>(props: useItemSelectionShortcutsProps<T>) {
  const isSelectionMode = ref(false);
  const activeElement = ref<HTMLElement | null>(null);
  const { onCtrlA, onCtrlClick, onShiftClick } = props || {};

  /** Check if the ctrl key is pressed */
  function isCtrlKey(e: KeyboardEvent) {
    // e.ctrlKey is for windows and e.metaKey is for mac
    return e.ctrlKey || e.metaKey;
  }

  function onKeyDown(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    if (isCtrlKey(e) || e.shiftKey) {
      isSelectionMode.value = true;

      if (e.key === "a") {
        handleCtrlA(e);
      }
    } else {
      onKeyUp(e);
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    if (!isCtrlKey(e) && !e.shiftKey) {
      isSelectionMode.value = false;
    }
  }

  function handleSelectionClick(e: KeyboardEvent, dataItem?: T) {
    if (isSelectionMode.value) {
      if (!e.shiftKey) {
        handleCtrlClick(e, dataItem);
      }

      if (!isCtrlKey(e)) {
        handleShiftClick(e, dataItem!);
      }
    }
  }

  function handleCtrlClick(e: KeyboardEvent, dataItem?: T) {
    if (dataItem) {
      e.preventDefault();

      if (onCtrlClick) {
        onCtrlClick({ dataItem });
      }
    }
  }

  function handleShiftClick(e: KeyboardEvent, dataItem: T) {
    if (dataItem) {
      e.preventDefault();

      if (onShiftClick) {
        onShiftClick({ dataItem });
      }
    }
  }

  function handleCtrlA(e: KeyboardEvent) {
    e.preventDefault();

    if (onCtrlA) {
      onCtrlA();
    }
  }

  function createSelectionProps(dataItem: T) {
    return {
      onClick: (e: Event) => {
        if (isSelectionMode.value) {
          handleSelectionClick(e as KeyboardEvent, dataItem);
        }
      },
    };
  }

  /**
   * Get the current screen, if the element is a dialog or a view
   */
  function getCurrentScreen() {
    if (props.element?.value && props.element.value.$el) {
      activeElement.value = props.element.value.$el.closest(".v-overlay--active") || window;
    }
  }

  /**
   * Add event listeners to the active element (dialog or view)
   */
  function addEventListeners() {
    if (activeElement.value) {
      activeElement.value.addEventListener("keydown", onKeyDown);
      activeElement.value.addEventListener("keyup", onKeyUp);
      if (activeElement.value instanceof HTMLElement) {
        activeElement.value.setAttribute("tabindex", "0");
      }
    }
  }

  /**
   * Remove event listeners from the active element (dialog or view)
   */
  function removeEventListeners() {
    if (activeElement.value) {
      activeElement.value.removeEventListener("keydown", onKeyDown);
      activeElement.value.removeEventListener("keyup", onKeyUp);
      activeElement.value.removeAttribute("tabindex");
    }
  }

  onMounted(() => {
    // Get the current screen
    getCurrentScreen();

    // Add event listeners
    addEventListeners();
  });

  onUnmounted(() => {
    // Reset the active element
    activeElement.value = null;

    // Remove event listeners
    removeEventListeners();
  });

  return {
    isSelectionMode,
    createSelectionProps,
    onKeyDown,
    onKeyUp,
  };
}
