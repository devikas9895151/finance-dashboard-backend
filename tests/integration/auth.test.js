const request = require("supertest");
const app = require("../../server");
const database = require("../../src/config/database");

beforeAll(async () => {
  await database.initialize();
});

describe("Auth API", () => {
  it("should login admin successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@finance.local",
        password: "admin123"
      });

    console.log("AUTH RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});