import { HttpStatusCodeEnum } from '@/models/enum/HttpStatusCodeEnum'
import { mediaKiwiAxiosInstance } from '@/services/interceptors/Mediakiwi'
import ListResult from '@/models/api/ListResult'
import ISectionResponse from '@/models/responses/ISectionResponse'

export const SectionAPIServices = {
  GetSections(): Promise<ListResult<ISectionResponse>> {
    return new Promise((resolve, reject) => {
      mediaKiwiAxiosInstance
        .get<ListResult<ISectionResponse>>(`/sections`)
        .then((response) => {
          if (response.status === HttpStatusCodeEnum.Ok) {
            resolve(response.data)
          }
        })
        .catch((err) => {
          //TODO: Show notification eventually
          reject(err)
        })
    })
  },
}
