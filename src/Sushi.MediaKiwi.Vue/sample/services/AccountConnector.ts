import { injectable, inject } from "tsyringe";
import type { AxiosError, AxiosInstance } from "axios";
import { Account } from "./../models/Account/Account";
import { CreateAccountRequest } from "@sample/models/Account/CreateAccountRequest";
import { TransferMoneyRequest } from "@sample/models/Account/TransferMoneyRequest";
import { DepositMoneyRequest } from "@sample/models/Account/DepositMoneyRequest";
import { WithdrawMoneyRequest } from "@sample/models/Account/WithdrawMoneyRequest";

@injectable()
export class AccountConnector {
  constructor(@inject("SampleApiAxiosInstance") private axios: AxiosInstance) { }

  async GetAccountAsync(number: string): Promise<Account> {
    const response = await this.axios.get<Account>(`/Account/${number}`);
    return response.data;
  }

  async CreateAccountAsync(request: CreateAccountRequest): Promise<Account> {
    const response = await this.axios.post<Account>("/Account/CreateAccount", request);
    return response.data;
  }

  async CloseAccountAsync(number: string): Promise<Account> {
    const response = await this.axios.post<Account>(`/Account/${number}/CloseAccount`);
    return response.data;
  }

  async TransferMoneyAsync(request: TransferMoneyRequest): Promise<Account> {
    const response = await this.axios.post<Account>("/Account/TransferMoney", request);
    return response.data;
  }

  async DepositAsync(number: string, request: DepositMoneyRequest): Promise<Account> {
    const response = await this.axios.post<Account>(`/Account/${number}/Deposit`, request);
    return response.data;
  }

  async WithdrawAsync(number: string, request: WithdrawMoneyRequest): Promise<Account> {
    const response = await this.axios.post<Account>(`/Account/${number}/Withdraw`, request);
    return response.data;
  }
}
