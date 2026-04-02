const request = require("supertest");
const app = require("../../server");
const database = require("../../src/config/database");

let token;

beforeAll(async () => {
  await database.initialize();

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "admin@finance.local",
      password: "admin123"
    });

  console.log("LOGIN RESPONSE:", res.body);

  token = res.body?.data?.accessToken;

  if (!token) {
    throw new Error("Login failed in test");
  }
});

// ✅ THIS PART IS MISSING IN YOUR FILE
describe("Records API", () => {
  it("should get records", async () => {
    const res = await request(app)
      .get("/api/records")
      .set("Authorization", `Bearer ${token}`);

    console.log("RECORDS RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
  });
});