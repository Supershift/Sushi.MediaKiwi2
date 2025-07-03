/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum AccountStatus {
  Open = "Open",
  Closed = "Closed",
}

export interface AccountDto {
  number: string | null;
  holderName: string | null;
  /** @format double */
  balance: number;
  status: AccountStatus;
}

export interface ClassWithRequirement {
  requiredString?: string | null;
  /** @format int32 */
  betweenOneAndTen?: number | null;
}

export interface Country {
  /**
   * @minLength 2
   * @maxLength 2
   */
  code: string;
  /**
   * @minLength 0
   * @maxLength 128
   */
  name: string;
}

export interface CountryListResult {
  result: Country[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
}

export interface CreateAccountRequest {
  /**
   * @minLength 1
   * @maxLength 64
   */
  number: string;
  /**
   * @minLength 1
   * @maxLength 64
   */
  holderName: string;
}

export interface CreateHotelRequest {
  /** @minLength 1 */
  countryCode: string;
  /** @minLength 1 */
  name: string;
  isActive: boolean;
  srp?: MoneyValue;
}

export interface DepositMoneyRequest {
  /** @format double */
  amount: number;
}

export interface FileUpload {
  id?: string | null;
  /**
   * @minLength 0
   * @maxLength 256
   */
  name: string;
  /** @format int64 */
  size: number;
  /** @format date-time */
  created?: Date;
  fileType?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
}

export interface HotelDto {
  /** @format int32 */
  id: number;
  /**
   * @minLength 2
   * @maxLength 2
   */
  countryCode: string;
  /**
   * @minLength 0
   * @maxLength 256
   */
  name: string;
  isActive: boolean;
  /** @format date-time */
  created?: Date;
  srp?: MoneyValue;
}

export interface HotelDtoListResult {
  result: HotelDto[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
}

export interface MoneyValue {
  /**
   * @minLength 0
   * @maxLength 3
   */
  currency: string;
  /** @format double */
  amount: number;
}

export interface TransferMoneyRequest {
  /**
   * @minLength 1
   * @maxLength 64
   */
  sourceAccountNumber: string;
  /**
   * @minLength 1
   * @maxLength 64
   */
  targetAccountNumber: string;
  /**
   * @format double
   * @min 0.01
   */
  amount: number;
}

export interface WithdrawMoneyRequest {
  /** @format double */
  amount: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title SampleApi
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  sample = {
    /**
     * No description
     *
     * @tags Account
     * @name AccountGet
     * @request GET:/sample/Account/{number}
     * @secure
     */
    accountGet: (number: string, params: RequestParams = {}) =>
      this.request<AccountDto, any>({
        path: `/sample/Account/${number}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountCreateAccountCreate
     * @request POST:/sample/Account/CreateAccount
     * @secure
     */
    accountCreateAccountCreate: (
      data: CreateAccountRequest,
      params: RequestParams = {},
    ) =>
      this.request<AccountDto, any>({
        path: `/sample/Account/CreateAccount`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountCloseAccountCreate
     * @request POST:/sample/Account/{number}/CloseAccount
     * @secure
     */
    accountCloseAccountCreate: (number: string, params: RequestParams = {}) =>
      this.request<AccountDto, any>({
        path: `/sample/Account/${number}/CloseAccount`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountTransferMoneyCreate
     * @request POST:/sample/Account/TransferMoney
     * @secure
     */
    accountTransferMoneyCreate: (
      data: TransferMoneyRequest,
      params: RequestParams = {},
    ) =>
      this.request<AccountDto, any>({
        path: `/sample/Account/TransferMoney`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountDepositCreate
     * @request POST:/sample/Account/{number}/Deposit
     * @secure
     */
    accountDepositCreate: (
      number: string,
      data: DepositMoneyRequest,
      params: RequestParams = {},
    ) =>
      this.request<AccountDto, any>({
        path: `/sample/Account/${number}/Deposit`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountWithdrawCreate
     * @request POST:/sample/Account/{number}/Withdraw
     * @secure
     */
    accountWithdrawCreate: (
      number: string,
      data: WithdrawMoneyRequest,
      params: RequestParams = {},
    ) =>
      this.request<AccountDto, any>({
        path: `/sample/Account/${number}/Withdraw`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Country
     * @name Countries
     * @request GET:/sample/countries
     * @secure
     */
    countries: (
      query?: {
        countryCode?: string;
        countryName?: string;
        /** @format int32 */
        pageIndex?: number;
        /** @format int32 */
        pageSize?: number;
        /** Field to sort by */
        sortBy?: "code" | "name";
        /** Direction to sort on */
        sortDirection?: "ASC" | "DESC";
      },
      params: RequestParams = {},
    ) =>
      this.request<CountryListResult, any>({
        path: `/sample/countries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Country
     * @name CountriesGet
     * @request GET:/sample/countries/{code}
     * @secure
     */
    countriesGet: (code: string, params: RequestParams = {}) =>
      this.request<Country, any>({
        path: `/sample/countries/${code}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Error
     * @name ErrorGenericError
     * @request GET:/sample/Error/genericError
     * @secure
     */
    errorGenericError: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sample/Error/genericError`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Error
     * @name ErrorAggregateError
     * @request GET:/sample/Error/aggregateError
     * @secure
     */
    errorAggregateError: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sample/Error/aggregateError`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Error
     * @name ErrorInternalServerError
     * @request GET:/sample/Error/internalServerError
     * @secure
     */
    errorInternalServerError: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sample/Error/internalServerError`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Error
     * @name ErrorStringError
     * @request GET:/sample/Error/stringError
     * @secure
     */
    errorStringError: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sample/Error/stringError`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Error
     * @name ErrorSlow
     * @request GET:/sample/Error/slow
     * @secure
     */
    errorSlow: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sample/Error/slow`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Error
     * @name ErrorRequirementsCreate
     * @request POST:/sample/Error/requirements
     * @secure
     */
    errorRequirementsCreate: (
      data: ClassWithRequirement,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/sample/Error/requirements`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags FileUpload
     * @name UploadCreate
     * @request POST:/sample/upload
     * @secure
     */
    uploadCreate: (data: File[], params: RequestParams = {}) =>
      this.request<FileUpload[], any>({
        path: `/sample/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hotel
     * @name Hotel
     * @request GET:/sample/Hotel
     * @secure
     */
    hotel: (
      query?: {
        countryCode?: string;
        isActive?: boolean;
        /** @format int32 */
        pageIndex?: number;
        /** @format int32 */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<HotelDtoListResult, any>({
        path: `/sample/Hotel`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hotel
     * @name HotelCreate
     * @request POST:/sample/Hotel
     * @secure
     */
    hotelCreate: (data: CreateHotelRequest, params: RequestParams = {}) =>
      this.request<HotelDto, any>({
        path: `/sample/Hotel`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hotel
     * @name HotelGet
     * @request GET:/sample/Hotel/{id}
     * @secure
     */
    hotelGet: (id: number, params: RequestParams = {}) =>
      this.request<HotelDto, any>({
        path: `/sample/Hotel/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hotel
     * @name HotelDelete
     * @request DELETE:/sample/Hotel/{id}
     * @secure
     */
    hotelDelete: (id: number, params: RequestParams = {}) =>
      this.request<HotelDto, any>({
        path: `/sample/Hotel/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hotel
     * @name HotelUpdate
     * @request PUT:/sample/Hotel/{id}
     * @secure
     */
    hotelUpdate: (
      id: number,
      data: CreateHotelRequest,
      params: RequestParams = {},
    ) =>
      this.request<HotelDto, any>({
        path: `/sample/Hotel/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ping
     * @name PingSamplePing
     * @request GET:/sample/Ping/sample/ping
     * @secure
     */
    pingSamplePing: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/sample/Ping/sample/ping`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
