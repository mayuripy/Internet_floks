import assert from "assert";
import request from "supertest";
import { beforeAll, describe, it } from "@jest/globals";
import { initTestServer } from "./init-test-server";
import { Application } from "express";
import { Server } from "http";

let app: Application;
let server: Server;

beforeAll(async () => {
  try {
    const { app: application, server: serv } = await initTestServer();
    app = application;
    server = serv;
  } catch (error) {
    console.error("Failed to initialize test server:", error);
    throw error;
  }
});

afterAll(async () => {
  server.close();
});

describe("Role API Tests", () => {
  describe("GET /v1/role", () => {
    it("should return a list of roles with correct structure", async () => {
      const response = await request(app).get("/v1/role").expect(200);

      assert.strictEqual(response.body.status, true);
      assert.strictEqual(typeof response.body.content, "object");
      assert.deepStrictEqual(Object.keys(response.body.content.meta), [
        "total",
        "pages",
        "page",
      ]);
      assert.deepStrictEqual(Object.keys(response.body.content.data[0]), [
        "id",
        "name",
        "createdAt",
        "updatedAt",
      ]);
    });
  });

  describe("POST /v1/role", () => {
    it("should create a new role with valid name", async () => {
      const roleName = "Community Incharge";
      const response = await request(app)
        .post("/v1/role")
        .send({ name: roleName })
        .expect(200);

      assert.strictEqual(response.body.status, true);
      assert.strictEqual(typeof response.body.content, "object");
      assert.strictEqual(typeof response.body.content.data, "object");
      assert.deepStrictEqual(Object.keys(response.body.content.data), [
        "id",
        "name",
        "created_at",
        "updated_at",
      ]);
      assert.strictEqual(response.body.content.data.name, roleName);
    });

    it("should fail to create role with invalid name", async () => {
      const invalidRoleName = "A";
      const response = await request(app)
        .post("/v1/role")
        .send({ name: invalidRoleName })
        .expect(400);
      assert.strictEqual(response.body.status, false);
      assert.strictEqual(
        response.body.errors[0].message,
        "Name should be at least 2 characters."
      );
    });
  });
});
