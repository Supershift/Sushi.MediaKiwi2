import { HttpStatusCode } from "axios";

export default interface ApiResultConstructor<T> {
  data?: T;
  status?: HttpStatusCode;
  ex?: unknown;
  message?: string;
}
