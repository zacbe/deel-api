const request = require("supertest");
const { expect } = require("chai");
const app = require("../../src/app");

describe("JobController", () => {
  describe("findAllUnpaidJobs", () => {
    it("Should return an error if user is not authenticated (401)", async () => {
      const user = { id: "no-a-user", firstName: "Harry" };
      const res = await request(app)
        .get(`/jobs/unpaid`)
        .set("profile_id", user.id)
        .send();
      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.equal("Unauthorized");
    });

    it("Should return a list of unpaid jobs", async () => {
      const user = { id: 1, firstName: "Harry" };
      const res = await request(app)
        .get(`/jobs/unpaid`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(200);
      expect(res.body.jobs).to.be.an("array").that.is.not.empty;
      res.body.jobs.forEach((element) => {
        expect(element.paid).to.be.null;
      });
    });

    it("Should return 404 if no unpaid jobs are found", async () => {
      const user = { id: 5, firstName: "John" };

      const res = await request(app)
        .get(`/jobs/unpaid`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.equal("No updaid jobs found");
    });
  });

  describe("payJob", () => {
    it("Should return an error if user is not authenticated (401)", async () => {
      const user = { id: "no-a-user", firstName: "Harry" };
      const res = await request(app)
        .post(`/jobs/9999/pay`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.equal("Unauthorized");
    });

    it("Should return 404 if the job does not exist", async () => {
      const user = { id: 1, firstName: "Harry" };

      const res = await request(app)
        .post("/jobs/9999/pay")
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.equal("Job not found");
    });

    it("", async () => {
      const user = { id: 1, firstName: "Harry" };
      const job = { id: 1, description: "work" };

      const res = await request(app)
        .post(`/jobs/${job.id}/pay`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(200);
      expect(res.body.message).to.equal("Successful Payment");
    });

    it("Should throw error if the job was already payed (400)", async () => {
      const user = { id: 1, firstName: "Harry" };
      const job = { id: 7, description: "work" };

      const res = await request(app)
        .post(`/jobs/${job.id}/pay`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.equal("Job has already been paid");
    });

    it("Should throw error if the the user balance is lower than the job's cost (400)", async () => {
      const user = { id: 4, firstName: "Ash" };
      const job = { id: 5, description: "work" };

      const res = await request(app)
        .post(`/jobs/${job.id}/pay`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.equal(
        "Client balance is insufficient to pay for job"
      );
    });

    it("Should throw error Job doesnt belong to the user in profile_id (400)", async () => {
      const user = { id: 1, firstName: "Harry" };
      const job = { id: 3, description: "work" };

      const res = await request(app)
        .post(`/jobs/${job.id}/pay`)
        .set("profile_id", user.id)
        .send();

      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.equal("Invalid user");
    });
  });
});
