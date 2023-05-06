const request = require("supertest");
const { expect } = require("chai");
const app = require("../../src/app");
const { basic } = require("../../src/config/auth");
const { password } = basic;

// date helpers
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

describe("AdminController", () => {
  describe("findBestPayedProfession", () => {
    it("Should return a list of best payed contractors (200)", async () => {
      const res = await request(app)
        .get("/admin/best-profession")
        .set("x-api-key", password)
        .query({ start: "2020-01-01", end: tomorrow, limit: 2 })
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.have.a.property("profession");
      expect(res.body.profession).to.be.a("string");
    });

    it("Should return an error if dates range are not a match (404)", async () => {
      const res = await request(app)
        .get("/admin/best-profession")
        .set("x-api-key", password)
        .query({ start: "2022-01-01", end: "2022-12-31" })
        .send();

      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.equal("No profession found");
    });

    it("Should return an error if API key is missing (401)", async () => {
      const res = await request(app).get("/admin/best-profession").send();
      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.equal("Unauthorized");
    });

    it("Should return an error if API key is invalid (401)", async () => {
      const res = await request(app)
        .get("/admin/best-profession")
        .set("x-api-key", "valid_api_key")
        .send();
      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.equal("Unauthorized");
    });
  });

  describe("findBestPayingClients", () => {
    it("Should return a list of best paying clients (200)", async () => {
      const res = await request(app)
        .get("/admin/best-clients")
        .set("x-api-key", password)
        .query({ start: "2020-01-01", end: tomorrow, limit: 2 })
        .send();

      expect(res.status).to.equal(200);
      expect(res.body.clients).to.be.an("array");
      expect(res.body.clients).to.have.lengthOf.at.most(2);
    });

    it("Should return an empty array if dates range are not a match (200)", async () => {
      const res = await request(app)
        .get("/admin/best-clients")
        .set("x-api-key", password)
        .query({ start: "2022-01-01", end: "2022-12-31" })
        .send();

      expect(res.status).to.equal(200);
      expect(res.body.clients).to.be.an("array").that.is.empty;
    });

    it("Should return an error if query params are missing (400)", async () => {
      const res = await request(app)
        .get("/admin/best-clients")
        .set("x-api-key", password)
        .send();

      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.equal(
        "Missing required query parameters: start, end"
      );
    });

    it("Should return an error if API key is missing (401)", async () => {
      const res = await request(app).get("/admin/best-clients").send();
      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.equal("Unauthorized");
    });

    it("Should return an error if API key is invalid (401)", async () => {
      const res = await request(app)
        .get("/admin/best-clients")
        .set("x-api-key", "valid_api_key")
        .send();
      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.equal("Unauthorized");
    });
  });
});
