import { IPagingResult, Paging } from "@/models";
import { defaultPageSize } from "@/constants";

export function useTablePaging() {
  /**
   * Returns a paginated array based on the current pagination settings.
   * @param data The data array to paginate.
   * @returns A slice of the data array representing the current page.
   */
  const pageArray = function (data: any[], currentPagination: Paging) {
    const { pageIndex = 0, pageSize = defaultPageSize } = currentPagination;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  /**
   * Calculates number of pages from the provided data array.
   */
  const calculatePaging = function (data: any[], currentPagination: Paging) {
    const { pageSize = defaultPageSize } = currentPagination;
    const totalCount = data.length;
    const pageCount = Math.ceil(totalCount / pageSize);
    return <IPagingResult>{ totalCount: totalCount, pageCount: pageCount };
  };

  return { pageArray, calculatePaging };
}
