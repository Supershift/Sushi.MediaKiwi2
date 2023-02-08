export default interface ListResult<T>{
    result: Array<T>;
    totalCount?: number | null;
    pageCount?: number | null;
}