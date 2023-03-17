import IListResult from "./IListResult";

export default class ListResult<T> implements IListResult<T> {
  result: Array<T> = [];
  totalCount?: number;
  pageCount?: number;
}
