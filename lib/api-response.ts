import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Standardized API Response helpers to ensure strict and consistent behaviors across all endpoints.
 */
export const ApiResponses = {
  /**
   * Returns a successful JSON response.
   * @param data The data to return.
   * @param status HTTP status code (default: 200).
   */
  success: (data: any, status = 200) => {
    return NextResponse.json(data, { status });
  },

  /**
   * Returns a generic error response.
   * @param message The error message.
   * @param status HTTP status code (default: 500).
   * @param details Optional additional details about the error.
   */
  error: (message: string, status = 500, details?: any) => {
    return NextResponse.json({ error: message, details }, { status });
  },

  /**
   * Returns a 400 Bad Request response specifically for Zod validation errors.
   * @param issues The Zod issues array.
   */
  validationError: (issues: z.ZodIssue[]) => {
    return NextResponse.json(
      { error: "Invalid input", details: issues },
      { status: 400 }
    );
  },

  /**
   * Returns a 401 Unauthorized response.
   */
  unauthorized: (message = "Unauthorized") => {
    return NextResponse.json({ error: message }, { status: 401 });
  },

  /**
   * Returns a 403 Forbidden response.
   */
  forbidden: (message = "Forbidden") => {
    return NextResponse.json({ error: message }, { status: 403 });
  },

  /**
   * Returns a 404 Not Found response.
   */
  notFound: (message = "Resource not found") => {
    return NextResponse.json({ error: message }, { status: 404 });
  },
  
  /**
   * Handles generic errors caught in a try-catch block.
   * Checks for specific error types (Auth, etc.) and returns the appropriate response.
   */
  handleError: (error: unknown) => {
     if (error instanceof Error) {
        if (error.message.includes("Unauthorized")) return ApiResponses.unauthorized();
        if (error.message.includes("Forbidden")) return ApiResponses.forbidden();
     }
     console.error("API Error:", error);
     return ApiResponses.error("An internal server error occurred.", 500);
  }
};
