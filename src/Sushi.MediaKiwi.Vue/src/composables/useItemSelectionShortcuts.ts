import { onMounted, onUnmounted, ref } from "vue";

type itemSelectionShortcutsParams<T> = {
  dataItem: T;
};

type useItemSelectionShortcutsProps<T> = {
  onCtrlA?: () => void | Promise<void>;
  onShiftClick?: (args: itemSelectionShortcutsParams<T>) => void | Promise<void>;
  onCtrlClick?: (args: itemSelectionShortcutsParams<T>) => void | Promise<void>;
};

export function useItemSelectionShortcuts<T>(props: useItemSelectionShortcutsProps<T>) {
  const isSelectionMode = ref(false);
  const { onCtrlA, onCtrlClick, onShiftClick } = props || {};

  function onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey || e.shiftKey) {
      isSelectionMode.value = true;

      if (e.key === "a") {
        handleCtrlA(e);
      }
    } else {
      onKeyUp(e);
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (!e.ctrlKey && !e.shiftKey) {
      isSelectionMode.value = false;
    }
  }

  function handleSelectionClick(e: KeyboardEvent, dataItem?: T) {
    if (isSelectionMode.value) {
      if (!e.shiftKey) {
        handleCtrlClick(e, dataItem);
      }

      if (!e.ctrlKey) {
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

  onMounted(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  });

  function createSelectionProps(dataItem: T) {
    return {
      onClick: (e: Event) => {
        if (isSelectionMode.value) {
          handleSelectionClick(e as KeyboardEvent, dataItem);
        }
      },
    };
  }

  return {
    isSelectionMode,
    createSelectionProps,
    enableSelectionMode: onKeyDown,
    disableSelectionMode: onKeyUp,
  };
}
