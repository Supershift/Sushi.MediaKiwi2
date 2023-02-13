import { IScreenResponse } from "@/models/responses";
import { HttpStatusCodeEnum } from "@/models/enum/HttpStatusCodeEnum";
import { mediaKiwiAxiosInstance } from "@/services/interceptors/Mediakiwi";

export const ScreenAPIServices = {
  GetScreens(sectionId: number): Promise<IScreenResponse> {
    return new Promise((resolve, reject) => {
      mediaKiwiAxiosInstance
        .get<IScreenResponse>(`/screenitems/${sectionId}`)
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
