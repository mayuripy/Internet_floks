import { Application } from "express";
import express from "express";
import cors from "cors";
import { globalErrorHandler } from "../middlewares";
import { initRoutes } from "./route";
import cookieSession from "cookie-session";
import { COOKIE_SECRET } from "../config";
import { NonParametricError } from "../errors";

let app: Application = express();

/**
 * Mounts middleware functions for handling CORS, parsing JSON and URL-encoded data,
 * and setting up cookie session.
 */
const mountMdw = () => {
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "x-client-key",
        "x-client-token",
        "x-client-secret",
        "Authorization",
        "Accept",
      ],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== "dev",
      secret: COOKIE_SECRET,
    })
  );
};


/**
 * Mounts application routes using the initRoutes function.
 */
const mountRoutes = () => {
  initRoutes(app);
};


mountMdw(); // Mounts middleware functions
mountRoutes(); // Mounts application routes


/**
 * Default route handler for handling routes that are not found.
 * Throws a NonParametricError with message "Route not found" and code "RESOURCE_NOT_FOUND".
 */
app.get("*", (req, res, next) => {
  next(
    new NonParametricError([
      { message: "Route not found", code: "RESOURCE_NOT_FOUND" },
    ])
  );
});

app.use(globalErrorHandler); // Global error handler middleware

export { app }; // Exports the configured Express application
