import { MoneyValue } from "@/models";

export interface Hotel {
  countryCode: string;
  created: string;
  name: string;
  isActive: boolean;
  id: number;
  srp?: MoneyValue;
}
