/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .type("form")
            .send({ title: "Some Book" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "Some Book");
              done();
            });
        });
      }
    );

    test("Test POST /api/books with no title given", function (done) {
      chai
        .request(server)
        .post("/api/books")
        .type("form")
        .send()
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field title");
          done();
        });
    });
  });

  suite("GET /api/books => array of books", function () {
    test("Test GET /api/books", function (done) {
      chai
        .request(server)
        .get("/api/books")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "response should be an array");
          done();
        });
    });
  });

  suite("GET /api/books/[id] => book object with [id]", function () {
    test("Test GET /api/books/[id] with id not in db", function (done) {
      chai
        .request(server)
        .get("/api/books/some_id")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        });
    });

    test("Test GET /api/books/[id] with valid id in db", function (done) {
      chai
        .request(server)
        .post("/api/books")
        .type("form")
        .send({ title: "My Book" })
        .end((err, res) => {
          chai
            .request(server)
            .get("/api/books/" + res.body._id)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "title");
              assert.equal(res.body.title, "My Book");
              done();
            });
        });
    });
  });

  suite(
    "POST /api/books/[id] => add comment/expect book object with id",
    function () {
      test("Test POST /api/books/[id] with comment", function (done) {
        chai
          .request(server)
          .post("/api/books")
          .type("form")
          .send({ title: "For Commentation" })
          .end((err, res) => {
            chai
              .request(server)
              .post("/api/books/" + res.body._id)
              .type("form")
              .send({ comment: "Beautiful Cover" })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.typeOf(res.body, "object");
                assert.property(res.body, "comments");
                assert.isArray(res.body.comments);
                assert.include(res.body.comments, "Beautiful Cover");
                done();
              });
          });
      });

      test("Test POST /api/books/[id] without comment field", function (done) {
        chai
          .request(server)
          .post("/api/books/63c0b9e6c0dc4c24968cb61b")
          .type("form")
          .send()
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          });
      });
    }
  );

  test("Test POST /api/books/[id] with comment, id not in db", function (done) {
    chai
      .request(server)
      .post("/api/books/invalid_id")
      .type("form")
      .send({ comment: "Beautiful Cover" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, '"no book exists"');
        done();
      });
  });

  suite("DELETE /api/books/[id] => delete book object id", function () {
    test("Test DELETE /api/books/[id] with valid id in db", function (done) {
      chai
        .request(server)
        .post("/api/books")
        .type("form")
        .send({ title: "For Deletion" })
        .end((err, res) => {
          chai
            .request(server)
            .delete("/api/books/" + res.body._id)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "delete successful");
              done();
            });
        });
    });

    test("Test DELETE /api/books/[id] with  id not in db", function (done) {
      chai
        .request(server)
        .delete("/api/books/invalid_id")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          chai
            .request(server)
            .delete("/api/books")
            .end((err, res) => {
              done();
            });
        });
    });
  });
});
