import { HttpStatusCodeEnum } from "@/models/enum/HttpStatusCodeEnum";
import { ResultCodeEnum } from "@/models/enum/ResultCodeEnum";

export default interface IApiResult<T> {
  data?: T;
  message?: string;
  status?: HttpStatusCodeEnum;
  /* Optional fields */
  title?: string;
  traceId?: string;
  type?: ResultCodeEnum;
}
