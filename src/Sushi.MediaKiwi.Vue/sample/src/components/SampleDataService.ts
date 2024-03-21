import type { Sorting } from "@/framework";
import { SortDirection } from "@/framework";
import type { ISampleData } from "./ISampleData";

const data = <ISampleData[]>[
  { id: 1, name: "Data A", countryCode: "NL", countryName: "Nederland", date: new Date("2023-03-14T12:00:00") },
  { id: 2, name: "Data B", countryCode: "NL", countryName: "Nederland", date: new Date("2023-03-14T13:00:00") },
  { id: 3, name: "Data C", countryCode: "BE", countryName: "België", date: new Date("2023-03-14T14:00:00") },
  { id: 4, name: "Data D", countryCode: "NL", countryName: "Nederland", date: new Date("2023-03-14T15:00:00") },
  { id: 5, name: "Data E", countryCode: "NL", countryName: "Nederland", date: new Date("2023-03-14T16:00:00") },
  { id: 6, name: "Data F", countryCode: "BE", countryName: "België", date: new Date("2023-03-14T17:00:00") },
  { id: 7, name: "Data G", countryCode: "NL", countryName: "Nederland", date: new Date("2023-03-14T18:00:00") },
  { id: 8, name: "Data H", countryCode: "NL", countryName: "Nederland", date: new Date("2023-03-14T19:00:00") },
  { id: 9, name: "Data I", countryCode: "BE", countryName: "België", date: new Date("2023-03-14T20:00:00") },
  { id: 10, name: "Data J", countryCode: "BE", countryName: "België", date: new Date("2023-03-14T21:00:00") },
];

export const SampleDataService = {
  GetAll(countryCode: string, sortOrder?: Sorting): ISampleData[] {
    let result = [...data];
    if (countryCode !== undefined) {
      result = result.filter((x) => x.countryCode == countryCode);
    }

    if (sortOrder) {
      if (sortOrder.sortBy === "countryName") {
        result = [...result.sort((a, b) => a.countryName.localeCompare(b.countryName))];
      } else if (sortOrder.sortBy === "id") {
        result = [...result.sort((a, b) => a.id - b.id)];
      }

      // Reverse sortorder
      if (sortOrder.sortDirection === SortDirection.Desc) {
        result = [...result.reverse()];
      }
    }

    return result;
  },
  Get(id: number): ISampleData | undefined {
    let result = data.find((x) => x.id == id);
    if (result !== undefined) {
      // make a copy to emulate this entry coming from an API
      result = { ...result };
    }
    return result;
  },
  async SaveAsync(item: ISampleData): Promise<void> {
    // this would be some sort of FK in reality
    if (item.countryCode == "NL") {
      item.countryName = "Nederland";
    } else if (item.countryCode == "BE") {
      item.countryName = "België";
    }

    // is this a new item or an existing?
    const index = data.findIndex((x) => x.id == item.id);
    if (index == -1) {
      // new item, pseudo generate new id
      const maxId = Math.max(...data.map((o) => o.id));
      item.id == maxId + 1;
      data.push(item);
    } else {
      // replace existing
      data[index] = item;
    }
  },
  async DeleteAsync(id: number): Promise<void> {
    const index = data.findIndex((x) => x.id == id);
    if (index != -1) {
      data.splice(index, 1);
    }
  },
};
