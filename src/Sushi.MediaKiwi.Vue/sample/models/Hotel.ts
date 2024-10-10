import { MoneyValue } from "@/models";
import type { HotelDto } from "./HotelDto";

export class Hotel {
  countryCode: string;
  created: string;
  name: string;
  isActive: boolean;
  id: number;
  srp?: MoneyValue;
  testValue: string;

  constructor(hotel: HotelDto);
  constructor(id: number, name: string, countryCode: string, created: string, isActive: boolean);
  constructor(hotel: number | HotelDto, name?: string, countryCode?: string, created?: string, isActive?: boolean) {
    if (typeof hotel === "object") {
      this.id = hotel.id;
      this.name = hotel.name;
      this.countryCode = hotel.countryCode;
      this.created = hotel.created;
      this.isActive = hotel.isActive;
      this.srp = hotel.srp;
    } else {
      this.id = hotel;
      this.name = name!;
      this.countryCode = countryCode!;
      this.created = created!;
      this.isActive = isActive!;
    }
    this.testValue = "Test value";
  }

  get srpFormatted(): string {
    if (this.srp) return Intl.NumberFormat("en", { style: "currency", currency: this.srp.currency }).format(this.srp.amount);
    else return "";
  }
}
