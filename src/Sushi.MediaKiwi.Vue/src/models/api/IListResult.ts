import { IPagingResult } from "./IPagingResult";

export default interface IListResult<T> extends IPagingResult {
  result: Array<T>;
}
