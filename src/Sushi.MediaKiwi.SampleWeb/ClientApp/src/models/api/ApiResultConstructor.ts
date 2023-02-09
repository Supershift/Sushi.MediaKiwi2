
import { HttpStatusCodeEnum } from "@/models/enum/HttpStatusCodeEnum";

export default interface ApiResultConstructor<T> {
  data?: T;
  status?: HttpStatusCodeEnum;
  ex?: unknown;
  message?: string;
}