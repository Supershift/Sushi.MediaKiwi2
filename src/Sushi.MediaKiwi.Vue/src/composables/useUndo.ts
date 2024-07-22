import { computed, ref } from "vue";

type dynamic = {
  [key: string]: any;
};

export function useUndo<T extends dynamic>() {
  const initial = ref<T>();
  const current = ref<T>();

  /**
   * Deep Clone an object including arrays and objects
   * @param obj
   * @returns
   */
  function deepClone(obj: any): any {
    // Check if obj is an array
    if (Array.isArray(obj)) {
      // If it's an array, create a new array and clone each element
      return obj.map((item) => deepClone(item));
    } else if (typeof obj === "object" && obj !== null) {
      // If it's an object, create a new object and clone each property
      const clonedObj = <any>{};
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    } else {
      // Base case: if it's neither an array nor an object, return the value as is
      return obj;
    }
  }

  /**
   * Deep compare two objects including arrays and objects
   * @param obj1
   * @param obj2
   * @returns
   */
  function deepCompare(obj1: any, obj2: any): boolean {
    // Check if both parameters are objects
    if (obj1 && obj2 && typeof obj1 === "object" && typeof obj2 === "object") {
      // Get the keys of each object
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      // Check if the number of keys is the same
      if (keys1.length !== keys2.length) {
        return false;
      }

      // Check if all keys in obj1 are present in obj2
      for (const key of keys1) {
        if (!obj2.hasOwnProperty(key)) {
          return false;
        }
      }

      // Recursively compare values of each key
      for (const key of keys1) {
        if (!deepCompare(obj1[key], obj2[key])) {
          return false;
        }
      }

      // If all conditions pass, objects are deeply equal
      return true;
    } else {
      // If at least one parameter is not an object, compare using strict equality
      return obj1 === obj2;
    }
  }

  /**
   * Set the Initial state
   * @param initialState
   */
  function setInitial(initialState: T) {
    // Set the initial state as a copy
    initial.value = deepClone({ ...initialState });

    // Set the currect state as a reference to the initial state
    current.value = initialState;
  }

  /**
   * Get the Initial state
   * @returns The initial state
   */
  function getInitial() {
    return initial.value;
  }

  const isDirty = computed(() => {
    if (!initial.value) return false;
    if (!current.value) return false;

    return !deepCompare(initial.value, current.value);
  });

  return {
    getInitial,
    setInitial,
    isDirty,
  };
}
