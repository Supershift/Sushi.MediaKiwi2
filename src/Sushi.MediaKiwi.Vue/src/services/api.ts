/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface EntraSettings {
  clientId?: string | null;
  tenantId?: string | null;
  audience?: string | null;
  instance?: string | null;
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
  /** @minLength 1 */
  id: string;
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
  sortOrder: number;
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
  localeId?: string | null;
  namespace?: string | null;
  key?: string | null;
  value?: string | null;
}

export interface TranslationListResult {
  result: Translation[];
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  pageCount: number;
}

export interface UpdateTranslationRequest {
  /** @minLength 1 */
  value: string;
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

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (securityData: SecurityDataType | null) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
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

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
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
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({ secure, path, type, query, format, body, ...params }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams = ((typeof secure === "boolean" ? secure : this.secure) && this.securityWorker && (await this.securityWorker(this.securityData))) || {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
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
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  mediakiwi = {
    /**
     * No description
     *
     * @tags AdminNavigationItem
     * @name ApiNavigationitemsDelete
     * @request DELETE:/mediakiwi/api/navigationitems/{id}
     * @secure
     */
    apiNavigationitemsDelete: (id: string, params: RequestParams = {}) =>
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
     * @name ApiNavigationitemsCreate
     * @request POST:/mediakiwi/api/navigationitems/{id}
     * @secure
     */
    apiNavigationitemsCreate: (id: string, data: NavigationItem, params: RequestParams = {}) =>
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
     * @name ApiNavigationitemsUpdate
     * @request PUT:/mediakiwi/api/navigationitems/{id}
     * @secure
     */
    apiNavigationitemsUpdate: (id: string, data: NavigationItem, params: RequestParams = {}) =>
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
     * @name ApiNavigationitemsDetail
     * @request GET:/mediakiwi/api/navigationitems/{id}
     * @secure
     */
    apiNavigationitemsDetail: (id: string, params: RequestParams = {}) =>
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
     * @name ApiNavigationitemsUpdateIdCreate
     * @request POST:/mediakiwi/api/navigationitems/{id}/updateId
     * @secure
     */
    apiNavigationitemsUpdateIdCreate: (id: string, data: string, params: RequestParams = {}) =>
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
     * @name ApiSectionsDelete
     * @request DELETE:/mediakiwi/api/sections/{id}
     * @secure
     */
    apiSectionsDelete: (id: string, params: RequestParams = {}) =>
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
     * @name ApiSectionsCreate
     * @request POST:/mediakiwi/api/sections/{id}
     * @secure
     */
    apiSectionsCreate: (id: string, data: Section, params: RequestParams = {}) =>
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
     * @name ApiSectionsUpdate
     * @request PUT:/mediakiwi/api/sections/{id}
     * @secure
     */
    apiSectionsUpdate: (id: string, data: Section, params: RequestParams = {}) =>
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
     * @name ApiSectionsDetail
     * @request GET:/mediakiwi/api/sections/{id}
     * @secure
     */
    apiSectionsDetail: (id: string, params: RequestParams = {}) =>
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
     * @name ApiSectionsUpdateIdCreate
     * @request POST:/mediakiwi/api/sections/{id}/updateId
     * @secure
     */
    apiSectionsUpdateIdCreate: (id: string, data: string, params: RequestParams = {}) =>
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
     * @name ApiAdminTranslationsList
     * @request GET:/mediakiwi/api/admin/translations
     * @secure
     */
    apiAdminTranslationsList: (
      query?: {
        localeId?: string;
        namespace?: string;
        key?: string;
        value?: string;
      },
      params: RequestParams = {}
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
     * @name ApiAdminTranslationsNamespacesList
     * @request GET:/mediakiwi/api/admin/translations/namespaces
     * @secure
     */
    apiAdminTranslationsNamespacesList: (
      query?: {
        localeId?: string;
      },
      params: RequestParams = {}
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
     * @name ApiAdminTranslationsKeysList
     * @request GET:/mediakiwi/api/admin/translations/keys
     * @secure
     */
    apiAdminTranslationsKeysList: (
      query?: {
        localeId?: string;
      },
      params: RequestParams = {}
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
     * @name ApiAdminTranslationsUpdate
     * @request PUT:/mediakiwi/api/admin/translations/{localeId}/{namespace}/{key}
     * @secure
     */
    apiAdminTranslationsUpdate: (localeId: string, namespace: string, key: string, data: UpdateTranslationRequest, params: RequestParams = {}) =>
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
     * @name ApiAdminTranslationsDelete
     * @request DELETE:/mediakiwi/api/admin/translations/{localeId}/{namespace}/{key}
     * @secure
     */
    apiAdminTranslationsDelete: (localeId: string, namespace: string, key: string, params: RequestParams = {}) =>
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
     * @name ApiIdentityproviderEntraList
     * @request GET:/mediakiwi/api/identityprovider/entra
     * @secure
     */
    apiIdentityproviderEntraList: (params: RequestParams = {}) =>
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
     * @name ApiLocalesEnabledList
     * @request GET:/mediakiwi/api/locales/enabled
     * @secure
     */
    apiLocalesEnabledList: (params: RequestParams = {}) =>
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
     * @name ApiLocalesList
     * @request GET:/mediakiwi/api/locales
     * @secure
     */
    apiLocalesList: (
      query?: {
        /** @format int32 */
        pageIndex?: number;
        /** @format int32 */
        pageSize?: number;
        /** @default false */
        onlyEnabled?: boolean;
      },
      params: RequestParams = {}
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
     * @name ApiLocalesDetail
     * @request GET:/mediakiwi/api/locales/{id}
     * @secure
     */
    apiLocalesDetail: (id: string, params: RequestParams = {}) =>
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
     * @name ApiLocalesCreate
     * @request POST:/mediakiwi/api/locales/{id}
     * @secure
     */
    apiLocalesCreate: (id: string, data: Locale, params: RequestParams = {}) =>
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
     * @name ApiLocalesDelete
     * @request DELETE:/mediakiwi/api/locales/{id}
     * @secure
     */
    apiLocalesDelete: (id: string, params: RequestParams = {}) =>
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
     * @name ApiLocalesUpdate
     * @request PUT:/mediakiwi/api/locales/{id}
     * @secure
     */
    apiLocalesUpdate: (id: string, data: Locale, params: RequestParams = {}) =>
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
     * @name ApiNavigationitemsList
     * @request GET:/mediakiwi/api/navigationitems
     * @secure
     */
    apiNavigationitemsList: (
      query?: {
        sectionId?: string;
        /** @format int32 */
        pageIndex?: number;
        /** @format int32 */
        pageSize?: number;
        /** Field to sort by */
        sortBy?: "name" | "sortOrder" | "id" | "sectionId" | "parentNavigationItemId";
        /** Direction to sort on */
        sortDirection?: "ASC" | "DESC";
      },
      params: RequestParams = {}
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
     * @name ApiRolesList
     * @request GET:/mediakiwi/api/roles
     * @secure
     */
    apiRolesList: (params: RequestParams = {}) =>
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
     * @name ApiSectionsList
     * @request GET:/mediakiwi/api/sections
     * @secure
     */
    apiSectionsList: (
      query?: {
        /** @format int32 */
        pageIndex?: number;
        /** @format int32 */
        pageSize?: number;
      },
      params: RequestParams = {}
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
     * @name ApiTranslationsDetail
     * @request GET:/mediakiwi/api/translations/{localeId}/{namespace}
     * @secure
     */
    apiTranslationsDetail: (localeId: string, namespace: string, params: RequestParams = {}) =>
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
     * @name ApiTranslationsCreate
     * @request POST:/mediakiwi/api/translations/{localeId}/{namespace}
     * @secure
     */
    apiTranslationsCreate: (localeId: string, namespace: string, data: Record<string, string>, params: RequestParams = {}) =>
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
     * @name ApiViewsDelete
     * @request DELETE:/mediakiwi/api/views/{id}
     * @secure
     */
    apiViewsDelete: (id: string, params: RequestParams = {}) =>
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
     * @name ApiViewsDetail
     * @request GET:/mediakiwi/api/views/{id}
     * @secure
     */
    apiViewsDetail: (id: string, params: RequestParams = {}) =>
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
     * @name ApiViewsCreate
     * @request POST:/mediakiwi/api/views/{id}
     * @secure
     */
    apiViewsCreate: (id: string, data: View, params: RequestParams = {}) =>
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
     * @name ApiViewsUpdate
     * @request PUT:/mediakiwi/api/views/{id}
     * @secure
     */
    apiViewsUpdate: (id: string, data: View, params: RequestParams = {}) =>
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
     * @name ApiViewsList
     * @request GET:/mediakiwi/api/views
     * @secure
     */
    apiViewsList: (
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
      params: RequestParams = {}
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
