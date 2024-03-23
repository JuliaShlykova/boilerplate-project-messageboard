const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { test, suite } = require("mocha");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Creating a new thread: POST request to /api/threads/{board}", function (done) {
    chai
      .request(server)
      //   .keepOpen()
      .post("/api/threads/test")
      .type("form")
      .send({ text: "text", delete_password: "password" })
      .set("content-type", "application/json")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, "text");
        done();
      });
  });
  test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function (done) {
    chai
      .request(server)
      //   .keepOpen()
      .get("/api/threads/test")
      .set("content-type", "application/json")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isBelow(res.body.length, 10);
        done();
      });
  });
  test("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", function (done) {
    chai
      .request(server)
      //   .keepOpen()
      .delete("/api/threads/test")
      .send({ thread_id: 0, delete_password: "invalid_password" })
      .set("content-type", "application/json")
      .end(function (err, res) {
        assert.equal(res.status, 401);
        done();
      });
  });
  test("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", function (done) {
    chai
      .request(server)
      //   .keepOpen()
      .delete("/api/threads/test")
      .send({ thread_id: 0, delete_password: "password" })
      .set("content-type", "application/json")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  test("Reporting a thread: PUT request to /api/threads/{board}", function (done) {
    chai
      .request(server)
      //   .keepOpen()
      .post("/api/threads/test")
      .type("form")
      .send({ text: "text", delete_password: "password" })
      .end();
    chai
      .request(server)
      .put("/api/threads/test")
      .send({ thread_id: 0 })
      .set("content-type", "application/json")
      .end(function (err, res) {
        assert.equal(res.text, "reported");
        done();
      });
  });
  test("Creating a new reply: POST request to /api/replies/{board}", function (done) {
    chai
      .request(server)
      //   .keepOpen()
      .post("/api/replies/test")
      .send({ thread_id: 0, delete_password: "password", text: "hello" })
      .set("content-type", "application/json")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  test("Viewing a single thread with all replies: GET request to /api/replies/{board}", function (done) {
    chai
      .request(server)
      //   .keepOpen()
      .post("/api/replies/test")
      .send({ thread_id: 0, delete_password: "password", text: "hello" })
      .set("content-type", "application/json")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
});
