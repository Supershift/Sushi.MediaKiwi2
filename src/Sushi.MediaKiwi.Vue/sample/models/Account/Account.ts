import { AccountStatus } from "./AccountStatus";

export type Account = {
  number: string;
  holderName: string;
  balance: number;
  status: AccountStatus;
};
