const request = require("supertest");
const { expect } = require("chai");
const app = require("../../src/app");

describe("JobController", () => {
  describe("updateProfileBalance", () => {
    it("Should return an error if user is not authenticated (401)", async () => {
      const user = { id: "no-a-user", firstName: "Harry" };
      const res = await request(app)
        .post(`/balances/deposit/${user.id}`)
        .set("profile_id", user.id)
        .send();
      expect(res.status).to.be.equal(401);
    });

    it("Should update balance successfully", async () => {
      const user = { id: 1, firstName: "Harry" };
      const res = await request(app)
        .post(`/balances/deposit/${user.id}`)
        .set("profile_id", user.id)
        .send({
          amount: "20",
        });

      expect(res.status).to.be.equal(200);
      expect(res.body.message).to.equal("Successful Deposit");
    });

    it("Should return an error for an invalid user", async () => {
      const user1 = { id: 1, firstName: "Harry" };
      const user2 = { id: 2, firstName: "Harry" };
      const res = await request(app)
        .post(`/balances/deposit/${user1.id}`)
        .set("profile_id", user2.id)
        .send({
          amount: "20",
        });

      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.equal("Invalid user");
    });

    it("Should return an error for an invalid deposit amount", async () => {
      const user = { id: 1, firstName: "Harry" };
      const res = await request(app)
        .post(`/balances/deposit/${user.id}`)
        .set("profile_id", user.id)
        .send({
          amount: "20000",
        });

      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.equal(
        "Deposit amount exceeds 25% of total job price"
      );
    });
  });
});
