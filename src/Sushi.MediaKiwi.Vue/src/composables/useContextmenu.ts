import { computed, ref, StyleValue } from "vue";

export function useContextmenu<T>() {
  const contextmenuIsVisible = ref(false);
  const contextMenuPosition = ref({ x: 0, y: 0 });
  const contextMenuStyles = computed<StyleValue>(() => {
    return {
      position: "absolute",
      left: `${contextMenuPosition.value.x}px`,
      top: `${contextMenuPosition.value.y}px`,
    };
  });
  const contextDataItem = ref<T | undefined>();

  function openContextMenu(event: MouseEvent, dataItem: T) {
    event.preventDefault();

    // Calculate menu position and set inline styles
    const offset = document.querySelector("html")?.scrollTop || 0;
    contextMenuPosition.value = { x: event.clientX, y: event.clientY + offset };

    contextDataItem.value = dataItem;
    contextmenuIsVisible.value = true;
  }

  const contextMenuProps = computed(() => {
    return {
      dataItem: contextDataItem.value!,
    };
  });

  return {
    openContextMenu,
    contextmenuIsVisible,
    contextMenuProps,
    contextMenuStyles,
  };
}
