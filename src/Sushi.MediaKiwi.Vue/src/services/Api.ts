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

export interface EntraSettings {
  clientId: string | null;
  tenantId: string | null;
  audience: string | null;
  instance: string | null;
}

export interface Locale {
  /** @minLength 1 */
  id: string;
  /**
   * @minLength 0
   * @maxLength 128
   */
  name: string;
  isEnabled: boolean;
}

export interface LocaleListResult {
  result: Locale[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
}

export interface NavigationItem {
  id?: string | null;
  /**
   * @minLength 0
   * @maxLength 128
   */
  name: string;
  /**
   * @minLength 0
   * @maxLength 64
   */
  sectionId: string;
  /**
   * @minLength 0
   * @maxLength 64
   */
  parentNavigationItemId?: string | null;
  /**
   * @minLength 0
   * @maxLength 64
   */
  viewId?: string | null;
  /**
   * @minLength 0
   * @maxLength 255
   */
  icon?: string | null;
  /** @format int32 */
  sortOrder?: number;
}

export interface NavigationItemListResult {
  result: NavigationItem[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
}

export interface Role {
  id?: string | null;
}

export interface RoleListResult {
  result: Role[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
}

export interface Section {
  /** @minLength 1 */
  id: string;
  /**
   * @minLength 0
   * @maxLength 128
   */
  name: string;
  /** @format int32 */
  sortOrder: number;
  /**
   * @minLength 0
   * @maxLength 128
   */
  icon?: string | null;
  roles: string[];
}

export interface SectionListResult {
  result: Section[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
}

export interface StringListResult {
  result: string[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
}

export interface Translation {
  localeId: string | null;
  namespace: string | null;
  key: string | null;
  value: string | null;
}

export interface TranslationListResult {
  result: Translation[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
}

export interface UpdateTranslationRequest {
  value: string | null;
}

export interface View {
  /** @minLength 1 */
  id: string;
  /**
   * @minLength 0
   * @maxLength 128
   */
  name: string;
  /**
   * @minLength 0
   * @maxLength 128
   */
  componentKey: string;
  parameterName?: string | null;
  roles: string[];
}

export interface ViewListResult {
  result: View[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
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
 * @title MediaKiwi
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  mediakiwi = {
    /**
     * No description
     *
     * @tags AdminNavigationItem
     * @name NavigationitemsDelete
     * @request DELETE:/mediakiwi/api/navigationitems/{id}
     * @secure
     */
    navigationitemsDelete: (id: string, params: RequestParams = {}) =>
      this.request<NavigationItem, any>({
        path: `/mediakiwi/api/navigationitems/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminNavigationItem
     * @name NavigationitemsCreate
     * @request POST:/mediakiwi/api/navigationitems/{id}
     * @secure
     */
    navigationitemsCreate: (
      id: string,
      data: NavigationItem,
      params: RequestParams = {},
    ) =>
      this.request<NavigationItem, any>({
        path: `/mediakiwi/api/navigationitems/${id}`,
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
     * @tags AdminNavigationItem
     * @name NavigationitemsUpdate
     * @request PUT:/mediakiwi/api/navigationitems/{id}
     * @secure
     */
    navigationitemsUpdate: (
      id: string,
      data: NavigationItem,
      params: RequestParams = {},
    ) =>
      this.request<NavigationItem, any>({
        path: `/mediakiwi/api/navigationitems/${id}`,
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
     * @tags NavigationItem
     * @name NavigationitemsGet
     * @request GET:/mediakiwi/api/navigationitems/{id}
     * @secure
     */
    navigationitemsGet: (id: string, params: RequestParams = {}) =>
      this.request<NavigationItem, any>({
        path: `/mediakiwi/api/navigationitems/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminNavigationItem
     * @name NavigationitemsUpdateIdCreate
     * @request POST:/mediakiwi/api/navigationitems/{id}/updateId
     * @secure
     */
    navigationitemsUpdateIdCreate: (
      id: string,
      data: string,
      params: RequestParams = {},
    ) =>
      this.request<NavigationItem, any>({
        path: `/mediakiwi/api/navigationitems/${id}/updateId`,
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
     * @tags AdminSection
     * @name SectionsDelete
     * @request DELETE:/mediakiwi/api/sections/{id}
     * @secure
     */
    sectionsDelete: (id: string, params: RequestParams = {}) =>
      this.request<Section, any>({
        path: `/mediakiwi/api/sections/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminSection
     * @name SectionsCreate
     * @request POST:/mediakiwi/api/sections/{id}
     * @secure
     */
    sectionsCreate: (id: string, data: Section, params: RequestParams = {}) =>
      this.request<Section, any>({
        path: `/mediakiwi/api/sections/${id}`,
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
     * @tags AdminSection
     * @name SectionsUpdate
     * @request PUT:/mediakiwi/api/sections/{id}
     * @secure
     */
    sectionsUpdate: (id: string, data: Section, params: RequestParams = {}) =>
      this.request<Section, any>({
        path: `/mediakiwi/api/sections/${id}`,
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
     * @tags Section
     * @name SectionsGet
     * @request GET:/mediakiwi/api/sections/{id}
     * @secure
     */
    sectionsGet: (id: string, params: RequestParams = {}) =>
      this.request<Section, any>({
        path: `/mediakiwi/api/sections/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminSection
     * @name SectionsUpdateIdCreate
     * @request POST:/mediakiwi/api/sections/{id}/updateId
     * @secure
     */
    sectionsUpdateIdCreate: (
      id: string,
      data: string,
      params: RequestParams = {},
    ) =>
      this.request<Section, any>({
        path: `/mediakiwi/api/sections/${id}/updateId`,
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
     * @tags AdminTranslation
     * @name AdminTranslations
     * @request GET:/mediakiwi/api/admin/translations
     * @secure
     */
    adminTranslations: (
      query?: {
        localeId?: string;
        namespace?: string;
        key?: string;
        value?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TranslationListResult, any>({
        path: `/mediakiwi/api/admin/translations`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminTranslation
     * @name AdminTranslationsNamespaces
     * @request GET:/mediakiwi/api/admin/translations/namespaces
     * @secure
     */
    adminTranslationsNamespaces: (
      query?: {
        localeId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StringListResult, any>({
        path: `/mediakiwi/api/admin/translations/namespaces`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminTranslation
     * @name AdminTranslationsKeys
     * @request GET:/mediakiwi/api/admin/translations/keys
     * @secure
     */
    adminTranslationsKeys: (
      query?: {
        localeId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StringListResult, any>({
        path: `/mediakiwi/api/admin/translations/keys`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminTranslation
     * @name AdminTranslationsUpdate
     * @request PUT:/mediakiwi/api/admin/translations/{localeId}/{namespace}/{key}
     * @secure
     */
    adminTranslationsUpdate: (
      localeId: string,
      namespace: string,
      key: string,
      data: UpdateTranslationRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/mediakiwi/api/admin/translations/${localeId}/${namespace}/${key}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminTranslation
     * @name AdminTranslationsDelete
     * @request DELETE:/mediakiwi/api/admin/translations/{localeId}/{namespace}/{key}
     * @secure
     */
    adminTranslationsDelete: (
      localeId: string,
      namespace: string,
      key: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/mediakiwi/api/admin/translations/${localeId}/${namespace}/${key}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags IdentityProvider
     * @name IdentityproviderEntra
     * @request GET:/mediakiwi/api/identityprovider/entra
     * @secure
     */
    identityproviderEntra: (params: RequestParams = {}) =>
      this.request<EntraSettings, any>({
        path: `/mediakiwi/api/identityprovider/entra`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Locale
     * @name LocalesEnabled
     * @request GET:/mediakiwi/api/locales/enabled
     * @secure
     */
    localesEnabled: (params: RequestParams = {}) =>
      this.request<LocaleListResult, any>({
        path: `/mediakiwi/api/locales/enabled`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Locale
     * @name Locales
     * @request GET:/mediakiwi/api/locales
     * @secure
     */
    locales: (
      query?: {
        /** @format int32 */
        pageIndex?: number;
        /** @format int32 */
        pageSize?: number;
        /** @default false */
        onlyEnabled?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<LocaleListResult, any>({
        path: `/mediakiwi/api/locales`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Locale
     * @name LocalesGet
     * @request GET:/mediakiwi/api/locales/{id}
     * @secure
     */
    localesGet: (id: string, params: RequestParams = {}) =>
      this.request<Locale, any>({
        path: `/mediakiwi/api/locales/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Locale
     * @name LocalesCreate
     * @request POST:/mediakiwi/api/locales/{id}
     * @secure
     */
    localesCreate: (id: string, data: Locale, params: RequestParams = {}) =>
      this.request<Locale, any>({
        path: `/mediakiwi/api/locales/${id}`,
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
     * @tags Locale
     * @name LocalesDelete
     * @request DELETE:/mediakiwi/api/locales/{id}
     * @secure
     */
    localesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/mediakiwi/api/locales/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Locale
     * @name LocalesUpdate
     * @request PUT:/mediakiwi/api/locales/{id}
     * @secure
     */
    localesUpdate: (id: string, data: Locale, params: RequestParams = {}) =>
      this.request<Locale, any>({
        path: `/mediakiwi/api/locales/${id}`,
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
     * @tags NavigationItem
     * @name Navigationitems
     * @request GET:/mediakiwi/api/navigationitems
     * @secure
     */
    navigationitems: (
      query?: {
        sectionId?: string;
        /** @format int32 */
        pageIndex?: number;
        /** @format int32 */
        pageSize?: number;
        /** Field to sort by */
        sortBy?:
          | "name"
          | "sortOrder"
          | "id"
          | "sectionId"
          | "parentNavigationItemId";
        /** Direction to sort on */
        sortDirection?: "ASC" | "DESC";
      },
      params: RequestParams = {},
    ) =>
      this.request<NavigationItemListResult, any>({
        path: `/mediakiwi/api/navigationitems`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Role
     * @name Roles
     * @request GET:/mediakiwi/api/roles
     * @secure
     */
    roles: (params: RequestParams = {}) =>
      this.request<RoleListResult, any>({
        path: `/mediakiwi/api/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Section
     * @name Sections
     * @request GET:/mediakiwi/api/sections
     * @secure
     */
    sections: (
      query?: {
        /** @format int32 */
        pageIndex?: number;
        /** @format int32 */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SectionListResult, any>({
        path: `/mediakiwi/api/sections`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Translation
     * @name TranslationsGet
     * @request GET:/mediakiwi/api/translations/{localeId}/{namespace}
     * @secure
     */
    translationsGet: (
      localeId: string,
      namespace: string,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/mediakiwi/api/translations/${localeId}/${namespace}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Translation
     * @name TranslationsCreate
     * @request POST:/mediakiwi/api/translations/{localeId}/{namespace}
     * @secure
     */
    translationsCreate: (
      localeId: string,
      namespace: string,
      data: Record<string, string>,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/mediakiwi/api/translations/${localeId}/${namespace}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags View
     * @name ViewsDelete
     * @request DELETE:/mediakiwi/api/views/{id}
     * @secure
     */
    viewsDelete: (id: string, params: RequestParams = {}) =>
      this.request<View, any>({
        path: `/mediakiwi/api/views/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags View
     * @name ViewsGet
     * @request GET:/mediakiwi/api/views/{id}
     * @secure
     */
    viewsGet: (id: string, params: RequestParams = {}) =>
      this.request<View, any>({
        path: `/mediakiwi/api/views/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags View
     * @name ViewsCreate
     * @request POST:/mediakiwi/api/views/{id}
     * @secure
     */
    viewsCreate: (id: string, data: View, params: RequestParams = {}) =>
      this.request<View, any>({
        path: `/mediakiwi/api/views/${id}`,
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
     * @tags View
     * @name ViewsUpdate
     * @request PUT:/mediakiwi/api/views/{id}
     * @secure
     */
    viewsUpdate: (id: string, data: View, params: RequestParams = {}) =>
      this.request<View, any>({
        path: `/mediakiwi/api/views/${id}`,
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
     * @tags View
     * @name Views
     * @request GET:/mediakiwi/api/views
     * @secure
     */
    views: (
      query?: {
        /** @format int32 */
        pageIndex?: number;
        /** @format int32 */
        pageSize?: number;
        /** Field to sort by */
        sortBy?: "name";
        /** Direction to sort on */
        sortDirection?: "ASC" | "DESC";
      },
      params: RequestParams = {},
    ) =>
      this.request<ViewListResult, any>({
        path: `/mediakiwi/api/views`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
