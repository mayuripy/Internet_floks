import assert from "assert";
import request from "supertest";
import { beforeAll, describe, it } from "@jest/globals";
import { initTestServer } from "./init-test-server";
import { Application } from "express";
import { INonParametricError, IParametricError } from "../interfaces";
import { Server } from "http";

let app: Application;
let server: Server;

beforeAll(async () => {
  try {
    const {app: application, server: serv} = await initTestServer();
    app = application;
    server = serv
  } catch (error) {
    console.error("Failed to initialize test server:", error);
    throw error;
  }
});

afterAll(async() => {
  server.close()
});

describe("Authentication API Tests", () => {
  describe("POST /v1/auth/signup", () => {
    it("should sign up a new user with valid details", async () => {
      const userDetails = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/v1/auth/signup")
        .send(userDetails)
        .expect(200);

      assert.equal(response.body.status, true);
      assert.equal(typeof response.body.content, "object");
      assert.equal(response.body.content.data.name, userDetails.name);
      assert.equal(response.body.content.data.email, userDetails.email);
      assert(!response.body.content.data.password);
      assert(response.body.content.meta.access_token);
    });

    it("should fail to sign up with invalid name", async () => {
      const invalidUserDetails = {
        name: "",
        email: "email@email.com",
        password: "Email@123",
      };

      const response = await request(app)
        .post("/v1/auth/signup")
        .send(invalidUserDetails)
        .expect(400);

      assert.equal(response.body.status, false);
      assert(
        response.body.errors.some(
          (err: INonParametricError) =>
            err.message === "Name must be at least 2 characters long."
        )
      );
    });

    it("should fail to sign up with invalid name and weak password.", async () => {
      const invalidUserDetails = {
        name: "N", // Invalid name (less than 2 characters)
        email: "email@email.com", // Invalid email format
        password: "1", // Invalid password (less than 6 characters)
      };

      const response = await request(app)
        .post("/v1/auth/signup")
        .send(invalidUserDetails)
        .expect(400);
      assert.equal(response.body.status, false);
      assert(
        response.body.errors.some(
          (err: INonParametricError) =>
            err.message === "Name must be at least 2 characters long."
        )
      );
      assert(
        response.body.errors.some(
          (err: INonParametricError) =>
            err.message === "Password should be at least 2 characters."
        )
      );
    });

    it("should not sign up a new user as the user with this email already exists.", async () => {
      const userDetails = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/v1/auth/signup")
        .send(userDetails)
        .expect(400);
      assert.equal(response.body.status, false);
      assert(
        response.body.errors.some(
          (err: IParametricError) =>
            err.param === "email" &&
            err.message === "User with this email address already exists." &&
            err.code === "RESOURCE_EXISTS"
        )
      );
    });
  });

  describe("POST /v1/auth/signin", () => {
    it("should sign in an existing user with valid details", async () => {
      const userDetails = {
        email: "john.doe@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/v1/auth/signin")
        .send(userDetails)
        .expect(200);

      assert.equal(response.body.status, true);
      assert.equal(typeof response.body.content, "object");
      assert.equal(response.body.content.data.email, userDetails.email);
      assert(!response.body.content.data.password);
      assert(response.body.content.meta.access_token);
    });

    it("should fail to sign in with invalid details", async () => {
      const invalidUserDetails = {
        email: "john.doe",
        password: "password123",
      };

      const response = await request(app)
        .post("/v1/auth/signin")
        .send(invalidUserDetails)
        .expect(400);

      assert.equal(response.body.status, false);
      assert(
        response.body.errors.some(
          (err: IParametricError) =>
            err.param === "email" &&
            err.message === "Please provide a valid email address." &&
            err.code === "INVALID_INPUT"
        )
      );
    });

    it("should fail to sign in with wrong password", async () => {
      const invalidUserDetails = {
        email: "john.doe@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/v1/auth/signin")
        .send(invalidUserDetails)
        .expect(400);

      assert.equal(response.body.status, false);
      assert(
        response.body.errors.some(
          (err: IParametricError) =>
            err.param === "password" &&
            err.message === "The credentials you provided are invalid." &&
            err.code === "INVALID_CREDENTIALS"
        )
      );
    });
  });

  describe("GET /v1/auth/me", () => {
    it("should return not signed error in case the user is not signed in", async () => {
      const response = await request(app).get("/v1/auth/me").expect(400);

      assert.equal(response.body.status, false);
      assert(
        response.body.errors.some(
          (err: INonParametricError) =>
            err.message === "You need to sign in to proceed." &&
            err.code === "NOT_SIGNEDIN"
        )
      );
    });
  });
});
