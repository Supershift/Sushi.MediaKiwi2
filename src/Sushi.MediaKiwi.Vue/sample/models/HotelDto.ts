import { MoneyValue } from "@/models";

export type HotelDto = {
  countryCode: string;
  created: string;
  name: string;
  isActive: boolean;
  id: number;
  srp?: MoneyValue;
};
