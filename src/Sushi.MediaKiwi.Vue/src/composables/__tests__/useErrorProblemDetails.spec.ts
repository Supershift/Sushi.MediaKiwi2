import "reflect-metadata";
import { vi, describe, it, expect } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { AxiosError } from "axios";
import { useErrorProblemDetails } from "../useErrorProblemDetails";
import { ErrorProblemDetails } from "@/models";
import { useI18next } from "../useI18next";

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useErrorProblemDetails", async () => {
  // Create a testing pinia store
  createTestingPinia();

  // Inject the snackbar store
  const { createErrorProblemDetails, getErrorMessages } = await useErrorProblemDetails();

  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  describe("getErrorMessages", async () => {
    it("should return undefined if errorProblemDetails is null", async () => {
      // Arrange
      const errorProblemDetails = null;

      // Act
      const result = getErrorMessages(errorProblemDetails);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return an array with the detail if errorProblemDetails has a detail property", async () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{ detail: "Some error detail" };

      // Act
      const result = getErrorMessages(errorProblemDetails);

      // Assert
      expect(result).toEqual(["Some error detail"]);
    });

    it("should return an array with the error message if errorProblemDetails has an error property", async () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{ error: { message: "Some error message" } };

      // Act
      const result = getErrorMessages(errorProblemDetails);

      expect(result).toEqual(["Some error message"]);
    });

    it("should return an array with the error message if errorProblemDetails has an error Array", async () => {
      // Arrange
      const aggregateErrorProblemDetails = <ErrorProblemDetails>{
        type: "AggregateError",
        error: {
          errors: [{ message: "Some error message" }, { message: "Some other message" }],
        },
      };

      // Act
      const result = getErrorMessages(aggregateErrorProblemDetails);

      expect(result).toEqual(["Some error message", "Some other message"]);
    });

    it("should return an array with the error message if errorProblemDetails has an errors Record", async () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{
        error: <Record<string, string[]>>{
          field1: ["Some error message"],
          field2: ["Some other message"],
        },
      };

      // Act
      const result = getErrorMessages(errorProblemDetails);

      expect(result).toEqual(["Some error message", "Some other message"]);
    });

    it("should return an array with the error message if errorProblemDetails has an errors Record", async () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{
        error: {
          errors: ["Some error message", "Some other message"],
        },
      };

      // Act
      const result = getErrorMessages(errorProblemDetails);

      expect(result).toEqual(["Some error message", "Some other message"]);
    });
  });

  describe("createErrorProblemDetails", async () => {
    describe("should handle unknown errors", async () => {
      it("should return Unknown Error if error is undefined", async () => {
        // Arrange
        const error = undefined;

        // Act
        const result = await createErrorProblemDetails(error);

        // Assert
        expect(result).toBeDefined();
      });

      it("should return Unknown error if error is empty", async () => {
        // Arrange
        const error = {};

        // Act
        const result = await createErrorProblemDetails(error);

        // Assert
        expect(result).toBeDefined();
      });
    });

    describe("should handle AxiosError", async () => {
      it("should return ErrorProblemDetails for a response with ErrorResponse", async () => {
        // Arrange
        const error = new AxiosError();
        error.response = <any>{
          status: 400,
          data: { title: "Bad request", detail: "Missing some field" },
        };

        // Act
        const result = await createErrorProblemDetails(error);

        // Assert
        expect(result).toBeDefined();
        expect(result.status).toBe(400);
        expect(result.detail).toBe("Missing some field");
      });

      it("should handle blob responses", async () => {
        // Arrange

        const error = new AxiosError();
        error.message = "Request failed with status code 500";
        error.request = {
          responseType: "blob",
        };
        error.config = {
          headers: <any>{
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          responseType: "blob",
          method: "post",
        };

        const mockBlob = new Blob(["Some error message"], { type: "application/json" });
        mockBlob.text = vi.fn().mockResolvedValue(JSON.stringify({ title: "Internal server error", detail: "An error occurred while processing the request" }));
        error.response = <any>{
          responseType: "blob",
          data: mockBlob,
        };

        // Act
        const result = await createErrorProblemDetails(error);

        // Assert
        expect(result).toBeDefined();
        expect(result.detail).toBe("An error occurred while processing the request");
      });

      it("should return ErrorProblemDetails an internal server error", async () => {
        // Arrange
        const error = new AxiosError();
        error.response = <any>{
          status: 500,
          data: `System.Exception: This is an internal server error
   at Sushi.MediaKiwi.SampleAPI.Controllers.ErrorController.GenerateInternalServerError() in C:\Code\Sushi.MediaKiwi2\src\Sushi.MediaKiwi.SampleAPI\Controllers\ErrorController.cs:line 46
   at lambda_method50(Closure, Object, Object[])
   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.SyncActionResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.InvokeActionMethodAsync()
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.InvokeNextActionFilterAsync()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.InvokeInnerFilterAsync()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Microsoft.AspNetCore.Localization.RequestLocalizationMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddlewareImpl.Invoke(HttpContext context)

HEADERS
=======
Accept: application/json, text/plain, */*
Host: localhost:7223
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: en,nl;q=0.9,en-US;q=0.8
Authorization: bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCJ9.eyJhdWQiOiI3Y2QyZWRkYi1iNzllLTRlMDQtYWMyNC0wMDExODIxY2NiOGUiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTVjOTBhMDQtNWVhOC00NjVlLWFjM2UtMWFhZTNiMjliMGM5L3YyLjAiLCJpYXQiOjE3MjQzOTk2ODcsIm5iZiI6MTcyNDM5OTY4NywiZXhwIjoxNzI0NDA1MDY4LCJhaW8iOiJBWlFBYS84WEFBQUFLUW9iLzd0aHFHc3lESDV2bzFTdW5YTzJwazVDUzUyRUNKWFc4VW00Ni9lL2I5ampzTjNuSldFTDB3WFhrdzc5RmFLcnhpc1lzY3J4RWNyakppUEQvVUVxbDkwWW1iTnZwd3lsM0FjaUhXbUVFbUVOeVQzU3hHUktWUEtXaXMxeXhWMkFhd0tGblNqTkluZ2VXYTJ5ZXRhVDI0T2QzaWdlc3JraFhxUFRjZ05VUkFnYUNnMkF6bU5MbWFBcXBmSlMiLCJhenAiOiI3Y2QyZWRkYi1iNzllLTRlMDQtYWMyNC0wMDExODIxY2NiOGUiLCJhenBhY3IiOiIwIiwibmFtZSI6IkplYW4tUGF1bCBLb21tZXJzIiwib2lkIjoiZTRlZjc2ODEtMjI3Ny00MzBlLWI5OTAtOTdkZTZhZDk2YTE3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiamVhbnBhdWwua29tbWVyc0BzdXBlcnNoaWZ0Lm5sIiwicmgiOiIwLkFRVUFCQXJKbGFoZVhrYXNQaHF1T3ltd3lkdnQwbnlldHdST3JDUUFFWUljeTQ0RkFJOC4iLCJyb2xlcyI6WyJBZG1pbiJdLCJzY3AiOiJhY2Nlc3NfdmlhX2FwcHJvbGVfYXNzaWdubWVudHMiLCJzdWIiOiJkeEFlWTY4NDI5RzhCWEJ6X2h3WWRPN1JuVVRTOF9vMG5nSERpd0RjWF9nIiwidGlkIjoiOTVjOTBhMDQtNWVhOC00NjVlLWFjM2UtMWFhZTNiMjliMGM5IiwidXRpIjoiWWpCQ0VpSTZZVXVqVUZRUmZaTTBBQSIsInZlciI6IjIuMCJ9.UOD3s3h81npY5HLzUH9JdMoswGdbA4zImhR1XH7xA6NhZm8lIM0wbhk5cpbV9g45Nyda6J-ABSDFWNfNgwMfyamDPSQaHUbNY6ChzdKKTafUm51PhkEPgYvKGZNzvSp8gdgZAVWpaA-cXQq9ECk5kRgACMAUJouKoUDe6FyP_Ye62c7AEX95z5v86reT_Za0c86tSTJs0Xx5WdNr-iDrqiA2RQ0PFoRiKd_vOJiczR7kW50hOnUafEjCGz3YvxjjiYBEQjLKZ0DcOVof8XozH0mC-BKsyKh-tvy8PfU7C_cKqqAHWOn-31pLIlnLdM_7iEz120SU1hkfeqdzjOKMQA
Cache-Control: no-cache
Origin: http://localhost:5173
Pragma: no-cache
Referer: http://localhost:5173/
Content-Length: 0
sec-ch-ua: "Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
sec-fetch-site: cross-site
sec-fetch-mode: cors
sec-fetch-dest: empty
priority: u=1, i
`,
        };

        // Act
        const result = await createErrorProblemDetails(error);

        // Assert
        expect(result).toBeDefined();
      });
    });

    describe("should handle Typescript Error", async () => {
      it("should return an ErrorProblemDetails object if error is an Error object", async () => {
        // Arrange
        const error = new Error("Some error message");

        // Act
        const result = await createErrorProblemDetails(error);

        // Assert
        expect(result.status).toBeUndefined();
        expect(result.title).toBeUndefined();
        expect(result.detail).toBe("Some error message");
        expect(result.error).toBeDefined();
        //   expect(result.error.message).toBe("Some error message");
      });
    });
  });
});
