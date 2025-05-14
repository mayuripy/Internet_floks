import { Application } from "express";
import router from "../routes";


/**
 * Initializes application routes by mounting the router middleware under the "/v1" prefix.
 * @param {Application} app - The Express application instance to initialize routes on.
 * @returns {Application} - The configured Express application instance with mounted routes.
 */
export const initRoutes = (app: Application): Application => {
    return app.use("/v1", router); // Mounts router middleware under the "/v1" prefix
};