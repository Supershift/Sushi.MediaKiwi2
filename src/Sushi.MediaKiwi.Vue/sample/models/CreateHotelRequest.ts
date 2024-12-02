import { MoneyValue } from "@/models";

export type CreateHotelRequest = {
  countryCode: string;
  name: string;
  isActive: boolean;
  srp?: MoneyValue;
};
