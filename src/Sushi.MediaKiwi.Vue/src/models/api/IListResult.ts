export default interface IListResult<T> {
  result: Array<T>;
  totalCount?: number | null;
  pageCount?: number | null;
}
