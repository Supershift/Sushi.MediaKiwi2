import type { Sorting } from "@/models";
import { injectable } from "tsyringe";
import { SortCustomers } from "../helpers/SortCustomers";
import { mapCountryName } from "../helpers/MapCountryName";
import { customerDataSet } from "../constants/CustomerDataSet";
import type { Customer } from "../models/Customer";

@injectable()
export class CustomerConnector {
  async GetAll(countryCode: string, sortOrder?: Sorting): Promise<Customer[]> {
    let result = customerDataSet.filter((x) => countryCode === undefined || x.countryCode === countryCode);

    if (sortOrder) {
      result = SortCustomers(result, sortOrder);
    }

    return result;
  }

  async Get(id: number): Promise<Customer | undefined> {
    let result = customerDataSet.find((x) => x.id == id);
    if (result !== undefined) {
      // make a copy to emulate this entry coming from an API
      result = { ...result };
    }
    return result;
  }

  async SaveAsync(item: Customer): Promise<void> {
    // Map countryCode to countryName
    item.countryName = mapCountryName(item.countryCode);

    const index = customerDataSet.findIndex((x) => x.id === item.id);

    if (index === -1) {
      // New item, generate new ID
      const maxId = customerDataSet.length > 0 ? Math.max(...customerDataSet.map((o) => o.id)) : 0;
      item.id = maxId + 1;
      customerDataSet.push(item);
    } else {
      // Update existing item
      customerDataSet[index] = item;
    }
  }

  async DeleteAsync(id: number): Promise<void> {
    const index = customerDataSet.findIndex((x) => x.id == id);
    if (index != -1) {
      customerDataSet.splice(index, 1);
    }
  }
}
