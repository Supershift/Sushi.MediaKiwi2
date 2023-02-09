import IListResult from '@/models/api/IListResult'

export default class ListResult<T> implements IListResult<T> {
  result: Array<T> = []
  totalCount?: number | null | undefined
  pageCount?: number | null | undefined

  /*
        Typescript supports only 1 constructor, this is a wordaround
        All parameters are passed named
    */
  constructor({ result, totalCount, pageCount }: ListResult<T>) {
    if (totalCount) {
      this.constructorWithTotalCount(result, totalCount)
    } else if (totalCount && pageCount) {
      this.constructorWithCounts(result, totalCount, pageCount)
    } else {
      this.constructorDefault(result)
    }
  }
  private constructorWithTotalCount(
    result: Array<T>,
    totalCount: number | null | undefined
  ) {
    this.result = result
    this.totalCount = totalCount
  }
  private constructorWithCounts(
    result: Array<T>,
    totalCount: number | null | undefined,
    pageCount: number | null | undefined
  ) {
    this.result = result
    this.totalCount = totalCount
    this.pageCount = pageCount
  }
  private constructorDefault(result: Array<T>) {
    this.result = result
  }
}
