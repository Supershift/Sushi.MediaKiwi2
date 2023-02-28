import type { INavigationResponse } from "@/models/responses";
import { HttpStatusCodeEnum } from "@/models/enum/HttpStatusCodeEnum";
import mediaKiwiAxiosInstance from "@/services/interceptors/Mediakiwi";
import type ListResult from "@/models/api/ListResult";

export const NavigationAPIServices = {
  GetNavigationItems(): Promise<ListResult<INavigationResponse>> {
    return new Promise((resolve, reject) => {
      mediaKiwiAxiosInstance
        .get<ListResult<INavigationResponse>>(`/navigationitems`)
        .then((response) => {
          if (response.status === HttpStatusCodeEnum.Ok) {
            resolve(response.data);
          }
        })
        .catch((err) => {
          //TODO: Show notification eventually
          reject(err);
        });
    });
  },
};
