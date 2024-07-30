import { ProblemDetails, ProblemDetailsError } from "@/models/errors/ProblemDetails";
import { HttpStatusCode } from "axios";

export function useProblemDetails() {
  function parseProblemDetails(error?: ProblemDetails | any) {

    if (!error) {
      return undefined;
    }

    if (error?.response?.data) {
      if (typeof error.response.data === "string") {
        return <ProblemDetails>{
          type: "Unknown",
          title: "Unknown error",
          status: error?.response?.status || HttpStatusCode.InternalServerError,
          detail: "An unknown error occurred. Please try again later.",
          error: {
            detail: [error.response.data],
          },
        }
      } else {
        return error.response.data as ProblemDetails;
      }
    }
  };

  function getProblemDetailMessages(err?: ProblemDetails | null, showDetails?: boolean) {
    console.log(err, showDetails);

    if (!err) {
      return "";
    }
    let text = err?.detail;

    if (showDetails) {
      if (err?.error) {

        if (!Array.isArray(err.error)) {
          text = err.error?.message;
        } else {
          text = "";
          err.error.forEach((er: ProblemDetailsError) => {
            text += `${er.message}; `;
          });
        }
      }
    }
    return text;
  }
  return {
    parseProblemDetails,
    getProblemDetailMessages
  };
}