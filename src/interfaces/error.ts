import { TNonParametricErrors, TParametricErrors } from "../types";

export interface IParametricError {
    param: string,
    message: string,
    code: TParametricErrors
}

export interface INonParametricError {
    message: string,
    code: TNonParametricErrors
}
