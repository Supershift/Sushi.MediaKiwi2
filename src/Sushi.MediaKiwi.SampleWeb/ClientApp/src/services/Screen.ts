import type { IScreenResponse } from "@/models/responses";
import { HttpStatusCodeEnum } from "@/models/enum/HttpStatusCodeEnum";
import mediaKiwiAxiosInstance from "@/services/interceptors/Mediakiwi";
import type ListResult from "@/models/api/ListResult";
import type { AxiosRequestConfig } from "axios";

export const ScreenAPIServices = {
  GetScreens(sectionId: number): Promise<ListResult<IScreenResponse>> {
    const request: AxiosRequestConfig = {
      data: sectionId
    }
    return new Promise((resolve, reject) => {
      mediaKiwiAxiosInstance
        .get<ListResult<IScreenResponse>>(`/screens`, request)
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
