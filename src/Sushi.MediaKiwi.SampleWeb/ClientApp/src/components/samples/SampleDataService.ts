import type { ISampleData } from "./ISampleData";

const data = <ISampleData[]>[
  { id: 1, name: "Data A", countryCode: "NL", countryName: "Nederland" },
  { id: 2, name: "Data B", countryCode: "NL", countryName: "Nederland" },
  { id: 3, name: "Data C", countryCode: "BE", countryName: "België" },
  { id: 4, name: "Data D", countryCode: "NL", countryName: "Nederland" },
  { id: 5, name: "Data E", countryCode: "NL", countryName: "Nederland" },
  { id: 6, name: "Data F", countryCode: "BE", countryName: "België" },
  { id: 7, name: "Data G", countryCode: "NL", countryName: "Nederland" },
  { id: 8, name: "Data H", countryCode: "NL", countryName: "Nederland" },
  { id: 9, name: "Data I", countryCode: "BE", countryName: "België" },
  { id: 10, name: "Data J", countryCode: "BE", countryName: "België" },
];

export const SampleDataService = {
  GetAll(countryCode: string | undefined): ISampleData[] {
    let result = data;
    if (countryCode !== undefined) {
      result = result.filter((x) => x.countryCode == countryCode);
    }
    return result;
  },
  Get(id: number): ISampleData | undefined {
    var result = data.find((x) => x.id == id);
    if (result !== undefined) {
      // make a copy to emulate this entry coming from an API
      result = { ...result };
    }
    return result;
  },
  Save(item: ISampleData) {
    // this would be some sort of FK in reality
    if (item.countryCode == "NL") {
      item.countryName = "Nederland";
    } else if (item.countryCode == "BE") {
      item.countryName = "België";
    }

    // is this a new item or an existing?
    var index = data.findIndex((x) => x.id == item.id);
    if (index == -1) {
      // new item, pseudo generate new id
      var maxId = Math.max(...data.map((o) => o.id));
      item.id == maxId + 1;
      data.push(item);
    } else {
      // replace existing
      data[index] = item;
    }
  },
};
