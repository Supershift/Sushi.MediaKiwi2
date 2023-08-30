import { defaultPageSize } from "@/constants";
import { ref } from "vue";

export function usePagination(): any {
  const pageIndex = ref(0);
  const pageSize = ref(defaultPageSize);

  /**
   * Change event
   * @param {number} value New page index
   */
  async function updatePageIndex(value: number) {
    // Update local values
    if (value !== null && value !== undefined) {
      pageIndex.value = value - 1;
    }
  }

  /**
   * Change event
   * @param {number} value New page size
   */
  async function updatePageSize(value: number) {
    // Update local values
    if (value !== null && value !== undefined) {
      pageSize.value = value;
    }
  }

  // /**
  //  * Change event
  //  * @param {number} index New page index
  //  * @param {number} size New page size
  //  */
  // async function paginationChanged(index: number, size?: number) {
  //   // Update local values
  //   if (index !== null && index !== undefined) {
  //     pageIndex.value = index;
  //   }

  //   if (size !== null && size !== undefined) {
  //     pageSize.value = size;
  //   }
  // }

  return {
    pageIndex,
    pageSize,
    updatePageIndex,
    updatePageSize,
  };
}
