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
  const { onCtrlA, onCtrlClick, onShiftClick } = props || {};

  /** Check if the ctrl key is pressed */
  function isCtrlKey(e: KeyboardEvent) {
    // e.ctrlKey is for windows and e.metaKey is for mac
    return e.ctrlKey || e.metaKey;
  }

  function onKeyDown(e: KeyboardEvent) {
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

  onMounted(() => {
    if (props.element?.value) {
      props.element.value.$el?.addEventListener("keydown", onKeyDown);
      props.element.value.$el?.addEventListener("keyup", onKeyUp);
      props.element.value.$el?.setAttribute("tabindex", "0");
    }
  });

  onUnmounted(() => {
    if (props.element?.value) {
      props.element.value.$el?.removeEventListener("keydown", onKeyDown);
      props.element.value.$el?.removeEventListener("keyup", onKeyUp);
      props.element.value.$el?.removeAttribute("tabindex");
    }
  });

  return {
    isSelectionMode,
    createSelectionProps,
    onKeyDown,
    onKeyUp,
  };
}
