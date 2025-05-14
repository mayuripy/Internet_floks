import { FieldValidationError } from "express-validator";
import { CustomError } from "./custom-error";
import { INonParametricError } from "../interfaces";




/**
 * NonParametricError is a custom error class that extends CustomError.
 * It represents errors without specific parameters, using an array of INonParametricError objects.
 * 
 * @param {INonParametricError[]} errors - An array of INonParametricError objects describing the errors.
 * 
 * @description
 *   - Constructs a new NonParametricError instance with an array of errors.
 *   - Ensures correct prototype chain for instanceof checks.
 * 
 * @method serializeErrors
 * @returns {Array<{ message: string; code: string }>} - An array of error objects, each containing 'message' and 'code'.
 */
export class NonParametricError extends CustomError {
    constructor(private errors: INonParametricError[]) {
      super("Non Parameter error");
  
      // Ensures correct prototype chain for instanceof checks
      Object.setPrototypeOf(this, NonParametricError.prototype);
    }
  
    /**
     * Serializes the NonParametricError instance into an array of error objects.
     * 
     * @method serializeErrors
     * @returns {Array<{ message: string; code: string }>} - An array of error objects, each containing 'message' and 'code'.
     */
    serializeErrors() {
      return this.errors.map((err: INonParametricError) => ({
        message: err.message,
        code: err.code,
      }));
    }
  }
  