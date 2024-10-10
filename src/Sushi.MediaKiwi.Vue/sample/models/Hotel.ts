import { MoneyValue } from "@/models";
import type { HotelDto } from "./HotelDto";

export class Hotel {
  countryCode: string;
  created: string;
  name: string;
  isActive: boolean;
  id: number;
  srp?: MoneyValue;

  constructor(hotel: HotelDto) {
    this.id = hotel.id;
    this.name = hotel.name;
    this.countryCode = hotel.countryCode;
    this.created = hotel.created;
    this.isActive = hotel.isActive;
    this.srp = hotel.srp;
  }

  get srpFormatted(): string {
    if (this.srp) return Intl.NumberFormat("en", { style: "currency", currency: this.srp.currency }).format(this.srp.amount);
    else return "";
  }
}
