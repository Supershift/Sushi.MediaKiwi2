import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosMock from 'axios';
import { createAxiosClient, createPublicAxiosClient } from '../createAxiosClient';

vi.mock('axios');
vi.mock('../axios/addAuthentication', () => ({
  addAuthentication: vi.fn().mockReturnValue({
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer test-token`,
    },
  }),
}));

describe('createAxiosClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const baseURL = 'https://api.example.com';

  it('should create an Axios client with default JSON content type and without authentication', () => {
    axiosMock.create = vi.fn().mockReturnValue(axiosMock);
    const spyon = vi.spyOn(axiosMock, 'create');

    createAxiosClient(baseURL);
    expect(axiosMock.create).toHaveBeenCalledWith({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(spyon).toHaveBeenCalledOnce();


  });
  it('should create an Axios client with default JSON content type and authentication', () => {
    axiosMock.create = vi.fn().mockReturnValue(axiosMock);
    axiosMock.interceptors.request.use = vi.fn().mockResolvedValue({
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer test-token`,
      },
    });
    const spyOn = vi.spyOn(axiosMock.interceptors.request, 'use');

    createAxiosClient(baseURL);

    expect(spyOn).toHaveBeenCalled();
  });
});

describe('createPublicAxiosClient', () => {
  it('should create a public Axios client with default JSON content type', () => {
    axiosMock.create = vi.fn().mockReturnValue(axiosMock);
    const spyon = vi.spyOn(axiosMock, 'create');
    const baseURL = 'https://public-api.example.com';
    createPublicAxiosClient(baseURL);

    expect(axiosMock.create).toHaveBeenCalledWith({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(spyon).toHaveBeenCalledOnce();

  });
});