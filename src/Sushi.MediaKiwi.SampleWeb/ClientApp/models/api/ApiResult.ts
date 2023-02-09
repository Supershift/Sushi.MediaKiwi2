import axios from 'axios'
import ApiResultConstructor from '@/models/api/ApiResultConstructor'
import { HttpStatusCodeEnum } from '@/models/enum/HttpStatusCodeEnum'
import IApiResult from '@/models/api/IApiResult'
import { ResultCodeEnum } from '@/models/enum/ResultCodeEnum'

export default class ApiResult<T> implements IApiResult<T> {
  data?: T
  message?: string
  status?: HttpStatusCodeEnum
  /* Additional Error fields */
  title?: string
  traceId?: string
  type?: ResultCodeEnum

  /*
    Typescript supports only 1 constructor, this is a wordaround
    All parameters are passed named
  */
  constructor({ data, status, ex }: ApiResultConstructor<T>) {
    if (ex) {
      this.constructorError(ex, data)
    } else {
      this.constructorDefault(data, status)
    }
  }

  private constructorDefault(data?: T, status?: HttpStatusCodeEnum) {
    this.data = data
    this.status = status
  }

  private constructorError(ex: unknown, data?: T): void {
    if (ex) {
      if (axios.isAxiosError(ex) && ex.response) {
        // Access to config, request, and response
        this.message = ex.response.statusText
        this.status = ex.response.status

        if (ex.response.data) {
          this.title = ex.response.data.title
          this.traceId = ex.response.data.traceId
          this.type = ex.response.data.type
        }
      } else {
        this.message = `${ex}`
        this.status = HttpStatusCodeEnum.InternalServerError
      }
    }

    if (data) {
      this.data = data
    }
  }
}
