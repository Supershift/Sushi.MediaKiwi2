import { computed, getCurrentInstance } from "vue";

export function useComponentContext() {
  // Get the current instance (component) from Vue
  const instance = getCurrentInstance();

  /** Get all defined props of the component and return them as a lowercase array */
  const definedProps = computed(() => {
    if (!instance?.vnode?.props) {
      return [];
    }

    // Return all defined props as a lowercase array
    return Object.keys(instance?.vnode?.props)?.map((prop) => {
      return prop.toLowerCase();
    });
  });

  /**
   * Returns if the current component has an implementation of the emit with the given name
   * @param e Name of the emit. Example: "click:row"
   * @returns
   */
  function hasDefinedEmit(e: string): boolean {
    // The full name of the emit is (for example) "onClick:row"
    const fullName = `on${e}`;

    return definedProps.value.includes(fullName);
  }

  // Return the context object
  return {
    instance,
    hasDefinedEmit,
  };
}
