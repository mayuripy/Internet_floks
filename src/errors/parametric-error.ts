import { CustomError } from "./custom-error";
import { IParametricError } from "../interfaces";

/**
 * ParametricError is a custom error class that extends CustomError.
 * It represents errors with specific parameters, using an array of IParametricError objects.
 * 
 * @param {IParametricError[]} errors - An array of IParametricError objects describing the errors.
 * 
 * @description
 *   - Constructs a new ParametricError instance with an array of errors.
 *   - Ensures correct prototype chain for instanceof checks.
 * 
 * @method serializeErrors
 * @returns {Array<{ param: string; message: string; code: string }>} - An array of error objects, each containing 'param', 'message', and 'code'.
 */
export class ParametricError extends CustomError {
    constructor(private errors: IParametricError[]) {
      super("Parameter error");
  
      // Ensures correct prototype chain for instanceof checks
      Object.setPrototypeOf(this, ParametricError.prototype);
    }
  
    /**
     * Serializes the ParametricError instance into an array of error objects.
     * 
     * @method serializeErrors
     * @returns {Array<{ param: string; message: string; code: string }>} - An array of error objects, each containing 'param', 'message', and 'code'.
     */
    serializeErrors() {
      return this.errors.map((err: IParametricError) => ({
        param: err.param,
        message: err.message,
        code: err.code,
      }));
    }
  }
  