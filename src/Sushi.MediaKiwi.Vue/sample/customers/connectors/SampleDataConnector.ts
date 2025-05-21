import type { Sorting } from "@/models";
import type { SampleData } from "../models/SampleData";
import { injectable } from "tsyringe";
import { sortSampleData } from "../helpers/SortSampleData";
import { mapCountryName } from "../helpers/MapCountryName";
import { sampleData } from "../constants/SampleData";

@injectable()
export class SampleDataConnector {
  async GetAll(countryCode: string, sortOrder?: Sorting): Promise<SampleData[]> {
    let result = sampleData.filter((x) => countryCode === undefined || x.countryCode === countryCode);

    if (sortOrder) {
      result = sortSampleData(result, sortOrder);
    }

    return result;
  }

  async Get(id: number): Promise<SampleData | undefined> {
    let result = sampleData.find((x) => x.id == id);
    if (result !== undefined) {
      // make a copy to emulate this entry coming from an API
      result = { ...result };
    }
    return result;
  }

  async SaveAsync(item: SampleData): Promise<void> {
    // Map countryCode to countryName
    item.countryName = mapCountryName(item.countryCode);

    const index = sampleData.findIndex((x) => x.id === item.id);

    if (index === -1) {
      // New item, generate new ID
      const maxId = sampleData.length > 0 ? Math.max(...sampleData.map((o) => o.id)) : 0;
      item.id = maxId + 1;
      sampleData.push(item);
    } else {
      // Update existing item
      sampleData[index] = item;
    }
  }

  async DeleteAsync(id: number): Promise<void> {
    const index = sampleData.findIndex((x) => x.id == id);
    if (index != -1) {
      sampleData.splice(index, 1);
    }
  }
}
