import 'reflect-metadata';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminTranslationConnector } from '../AdminTranslationConnector';
import { Translation, ListResult } from "@/models";
import axiosMock from 'axios';

vi.mock('axios');

let connector: AdminTranslationConnector;

describe('AdminTranslationConnector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connector = new AdminTranslationConnector(axiosMock);
  });
  it('Update method sends a PUT request with the correct parameters', async () => {
    const translation: Translation = {
      localeId: 'en-US',
      namespace: 'testNamespace',
      key: 'testKey',
      value: 'testValue'
    };

    await connector.Update(translation);

    expect(axiosMock.put).toHaveBeenCalledWith(
      `/admin/translations/${encodeURIComponent(translation.localeId)}/${encodeURIComponent(translation.namespace)}/${encodeURIComponent(translation.key)}`,
      translation
    );
  });

  it('GetKeys method sends a GET request with the correct query parameters', async () => {
    const mockData: ListResult<string> = { result: ['key1', 'key2'], totalCount: 2 };
    axiosMock.get = vi.fn().mockResolvedValue({ data: mockData });

    const result = await connector.GetKeys('en-US');

    expect(axiosMock.get).toHaveBeenCalledWith('/admin/translations/keys', { params: { localeId: 'en-US' } });
    expect(result).toEqual(mockData);
  });

  it('GetAll method sends a GET request with the correct query parameters', async () => {
    const mockData: ListResult<Translation> = {
      result: [{ localeId: 'en-US', namespace: 'test', key: 'key1', value: 'value1' }],
      totalCount: 1
    };
    axiosMock.get = vi.fn().mockResolvedValue({ data: mockData });

    const result = await connector.GetAll('en-US', 'test', 'key1', 'value1');

    expect(axiosMock.get).toHaveBeenCalledWith('/admin/translations', { params: { localeId: 'en-US', namespace: 'test', key: 'key1', value: 'value1' } });
    expect(result).toEqual(mockData);
  });

  it('GetNamespaces method sends a GET request with the correct query parameters', async () => {
    const mockData: ListResult<string> = { result: ['namespace1', 'namespace2'], totalCount: 2 };
    axiosMock.get = vi.fn().mockResolvedValue({ data: mockData });

    const result = await connector.GetNamespaces('en-US');

    expect(axiosMock.get).toHaveBeenCalledWith('/admin/translations/namespaces', { params: { localeId: 'en-US' } });
    expect(result).toEqual(mockData);
  });
});