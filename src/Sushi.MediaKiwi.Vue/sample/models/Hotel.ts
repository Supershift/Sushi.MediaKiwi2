import { MoneyValue } from "@/framework";

export interface Hotel {
  countryCode: string;
  created: string;
  name: string;
  isActive: boolean;
  id: number;
  srp?: MoneyValue;
}
