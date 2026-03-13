// error.ts
// Error message extraction utilities

/**
 * Converts an unknown error into a user-friendly error message string.
 * Handles Error instances, StrapiConfigError, and unexpected error types.
 */
export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}
