import { injectable, inject } from "tsyringe";
import type { AxiosInstance } from "axios";
import { FileUpload } from "./../models/FileUpload";
import { ListResult } from "@/models";

@injectable()
export class FileUploadConnector {
  constructor(@inject("SampleApiAxiosInstance") private axios: AxiosInstance) {}

  async PostFiles(files: File[]): Promise<ListResult<FileUpload>> {
    const response = await this.axios.post<ListResult<FileUpload>>("/upload", files);
    return response.data;
  }
}
