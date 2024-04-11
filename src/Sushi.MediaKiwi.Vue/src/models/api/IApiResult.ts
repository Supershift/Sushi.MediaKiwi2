import { HttpStatusCode } from "axios";
import { ResultCodeEnum } from "@/models/enum/ResultCodeEnum";

export default interface IApiResult<T> {
  data?: T;
  message?: string;
  status?: HttpStatusCode;
  /* Optional fields */
  title?: string;
  traceId?: string;
  type?: ResultCodeEnum;
}
