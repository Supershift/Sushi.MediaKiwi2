import { ListResult, Paging } from "@/models";
import { SectionDto } from "@/models";

export interface ISectionConnector {
  CreateSection(id: string, request: SectionDto): Promise<SectionDto>;
  DeleteSection(id: string): Promise<void>;
  GetSections(paging?: Paging): Promise<ListResult<SectionDto>>;
  GetSection(id: string): Promise<SectionDto | undefined>;
  UpdateSection(id: string, request: SectionDto): Promise<SectionDto>;
}
