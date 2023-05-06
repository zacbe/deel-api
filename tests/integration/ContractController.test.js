// dependency imports
const request = require("supertest");
const { expect } = require("chai");

// local imports
const app = require("../../src/app");

describe("ContractController", () => {
  describe("findOneContract", () => {
    it("Should return an error if user is not authenticated (401)", async () => {
      const user = { id: "no-a-user", firstName: "Harry" };
      const contract = {
        id: 2,
        terms: "bla bla bla",
        status: "in_progress",
        ContractorId: 6,
        ClientId: 1,
      };

      const res = await request(app)
        .get(`/contracts/${contract.id}`)
        .set("profile_id", user.id)
        .send();
      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.equal("Unauthorized");
    });

    it("Should return a contract when given a valid ID", async () => {
      const user = { id: 1, firstName: "Harry" };
      const contract = {
        id: 2,
        terms: "bla bla bla",
        status: "in_progress",
        ContractorId: 6,
        ClientId: 1,
      };

      const res = await request(app)
        .get(`/contracts/${contract.id}`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(200);
      expect(res.body.contract).to.deep.include(contract);
    });

    it("Should return a 404 error when given an invalid ID", async () => {
      const user = { id: 1, firstName: "Harry" };
      const contract = {
        id: 23, // nox-existent
        terms: "bla bla bla",
        status: "in_progress",
        ContractorId: 6,
        ClientId: 1,
      };

      const res = await request(app)
        .get(`/contracts/${contract.id}`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.equal("Contract not found");
    });

    it("Should return 404 if the user is not the Client/Contractor of the Contract", async () => {
      const user = { id: 1, name: "Test User" };
      const contract = {
        id: 3,
        terms: "bla bla bla",
        status: "in_progress",
        ContractorId: 6,
        ClientId: 2,
      };

      const res = await request(app)
        .get(`/contracts/${contract.id}`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.equal("Contract not found");
    });
  });

  describe("findAllContracts", () => {
    it("Should return an error if user is not authenticated (401)", async () => {
      const user = { id: "no-a-user", firstName: "Harry" };
      const res = await request(app)
        .get(`/contracts`)
        .set("profile_id", user.id)
        .send();
      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.equal("Unauthorized");
    });

    it("Should return a contract when given a valid ID", async () => {
      const user = { id: 1, firstName: "Harry" };

      const res = await request(app)
        .get(`/contracts`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(200);
      expect(res.body.contracts).to.be.an("array");
      res.body.contracts.forEach((element) => {
        expect(element).to.not.equal("terminated");
      });
    });
  });
});
