/**
 * CustomError is an abstract base class for defining custom error types.
 * Extend this class to create specific error classes with custom error serialization.
 * 
 * @param {string} message - A descriptive message of the error.
 * @param {string} [description] - Optional. Additional details or context for the error.
 * @param {number} [statusCode] - Optional. HTTP status code associated with the error.
 * 
 * @description
 *   - Constructs a new CustomError instance with the provided message, optional description, and statusCode.
 *   - Ensures correct prototype chain for instanceof checks.
 *   - Captures stack trace for debugging purposes.
 * 
 * @abstract
 * @method serializeErrors
 * @returns {Array<{ param?: string; message: string; code: string }>} - An array of error objects, each containing 'message', 'code', and optionally 'param'.
 */
export abstract class CustomError extends Error {
  constructor(message: string, description?: string, statusCode?: number) {
    super(message);

    // Ensures correct prototype chain for instanceof checks
    Object.setPrototypeOf(this, CustomError.prototype);

    // Captures stack trace for debugging purposes
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Abstract method that must be implemented by subclasses.
   * Should serialize error information into a structured format.
   * 
   * @abstract
   * @method serializeErrors
   * @returns {Array<{ param?: string; message: string; code: string }>} - An array of error objects, each containing 'message', 'code', and optionally 'param'.
   */
  abstract serializeErrors(): {
    param?: string;
    message: string;
    code: string;
  }[];
}
