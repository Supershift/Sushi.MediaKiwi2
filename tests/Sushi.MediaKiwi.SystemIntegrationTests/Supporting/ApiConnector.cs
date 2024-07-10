using Microsoft.AspNetCore.Mvc;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.Services.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.SystemIntegrationTests.Supporting
{
    internal record ConnectorError : Error
    {
        public ConnectorError(string message) : base(message) { }

        public string? Reason { get; set; }
        public int Status { get; set; }
        public string? Detail { get; set; }
        public ProblemDetails? ProblemDetails { get; set; }
    }

    internal class ApiConnector
    {
        private readonly HttpClient _client;
        private readonly JsonSerializerOptions _jsonOptions;

        public ApiConnector(HttpClient client)
        {
            _client = client;
            _jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        }

        public async Task<Result<ListResult<Section>, ConnectorError>> GetSectionsAsync()
        {
            string url = "mediakiwi/api/sections";
            var result = await CallApiAsync<ListResult<Section>>(url, HttpMethod.Get);
            return result;
        }

        internal async Task<Result<TResult, ConnectorError>> PostAsync<TRequest, TResult>(string url, TRequest request)
            where TResult : class
        {
            var content = new StringContent(
                JsonSerializer.Serialize(request, _jsonOptions),
                Encoding.UTF8,
                "application/json"
            );
            using var response = await _client.PostAsync(url, content);
            return await HandleResponseAsync<TResult, ConnectorError>(response);
        }

        internal async Task<Result<T, ConnectorError>> CallApiAsync<T>(
            string url,
            HttpMethod method,
            HttpContent? content = null
        )
            where T : class
        {
            if (method == HttpMethod.Get)
            {
                using var response = await _client.GetAsync(url);
                return await HandleResponseAsync<T, ConnectorError>(response);
            }
            else if (method == HttpMethod.Delete)
            {
                using var response = await _client.DeleteAsync(url);
                return await HandleResponseAsync<T, ConnectorError>(response);
            }
            else if (method == HttpMethod.Post)
            {
                using var response = await _client.PostAsync(url, content);
                return await HandleResponseAsync<T, ConnectorError>(response);
            }
            else
            {
                throw new NotImplementedException(
                    $"{method} is not yet implemented in the test connector, because we didn't need it yet."
                );
            }
        }

        private async Task<Result<T, ConnectorError>> HandleResponseAsync<T, McError>(HttpResponseMessage response)
            where T : class
        {
            if (response.IsSuccessStatusCode)
            {
                if (typeof(T) == typeof(string))
                {
                    return (await response.Content.ReadAsStringAsync() as T)!;
                }
                else if (typeof(T) == typeof(byte[]))
                {
                    return (await response.Content.ReadAsByteArrayAsync() as T)!;
                }
                else
                {
                    if (response.Content.Headers.ContentLength > 0)
                        return JsonSerializer.Deserialize<T>(await response.Content.ReadAsStreamAsync(), _jsonOptions)!;
                    else
                        return default(T)!;
                }
            }
            else
            {
                var error = new ConnectorError("Error when connecting to API")
                {
                    Detail = await response.Content.ReadAsStringAsync(),
                    Reason = response.ReasonPhrase,
                    Status = (int)response.StatusCode
                };

                try
                {
                    // Try to deserialize the response as a ProblemDetails object
                    error.ProblemDetails = JsonSerializer.Deserialize<ProblemDetails>(error.Detail, _jsonOptions)!;
                }
                catch
                {
                    // Failed to deserialize the response as a ProblemDetails object. Just return as it is
                    return error;
                }

                return error;
            }
        }
    }
}
