import { Error } from "./Error";

/**
 * Microsoft.AspNetCore.Mvc.ProblemDetails
 */
export type ProblemDetails = {
  /** A URI reference that identifies the problem type. */
  type?: string;

  /** A short, human-readable summary of the problem. */
  title?: string;

  /** The HTTP status code for this occurrence of the problem. */
  status?: number;

  /** A human-readable explanation of the problem. */
  detail?: string;

  /** A URI reference for more information about the problem. */
  instance?: string;

  /** Additional details about the problem. */
  error?: Error | Error[] | Record<string, string[]>;

  /** Additional details about the problem. */
  errors?: Error | Error[] | Record<string, string[]>;
};
