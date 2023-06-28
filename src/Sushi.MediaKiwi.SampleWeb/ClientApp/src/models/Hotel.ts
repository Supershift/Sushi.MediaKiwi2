import { MoneyValue } from "@supershift/mediakiwi-vue";

export interface Hotel {
  countryCode: string;
  created: string;
  name: string;
  isActive: boolean;
  id: number;
  srp?: MoneyValue;
}
