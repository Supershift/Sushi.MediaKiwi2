import { computed, ref } from "vue";

export function useContextmenu<T>() {
  const contextmenuIsVisible = ref<boolean>(false);
  const contextMenuPosition = ref<[x: number, y: number]>();
  const contextDataItem = ref<T | undefined>();

  /**
   * Open the context menu
   * @param event
   * @param dataItem
   */
  function openContextMenu(event: MouseEvent, dataItem: T) {
    event.preventDefault();

    // Set the position of the context menu
    contextMenuPosition.value = [event.clientX, event.clientY];

    // Set the data item
    contextDataItem.value = dataItem;

    // Show the context menu
    contextmenuIsVisible.value = true;
  }

  /**
   * Context menu props for the context menu component
   */
  const contextMenuProps = computed(() => {
    return {
      dataItem: contextDataItem.value!,
    };
  });

  /**
   * Context menu position props for the context menu component
   */
  const contextMenuPositionProps = computed(() => {
    return {
      modelValue: contextmenuIsVisible.value,
      target: contextMenuPosition.value,
      "onUpdate:modelValue": (value: boolean) => {
        contextmenuIsVisible.value = value;
      },
    };
  });

  return {
    openContextMenu,
    contextmenuIsVisible,
    contextMenuProps,
    contextMenuPosition,
    contextMenuPositionProps,
  };
}
