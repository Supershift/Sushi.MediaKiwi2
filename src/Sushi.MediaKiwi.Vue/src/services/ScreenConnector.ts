import type { IScreenResponse } from "@/models/responses";
import { HttpStatusCodeEnum } from "@/models/enum/HttpStatusCodeEnum";
import mediaKiwiAxiosInstance from "@/services/interceptors/MediakiwiAxiosInstance";
import type ListResult from "@/models/api/ListResult";

export const ScreenAPIServices = {
  GetScreens(): Promise<ListResult<IScreenResponse>> {
    return new Promise((resolve, reject) => {
      mediaKiwiAxiosInstance
        .get<ListResult<IScreenResponse>>(`/screens`)
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
