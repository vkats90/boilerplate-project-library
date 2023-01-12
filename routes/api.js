/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const {
  listBooks,
  addBook,
  addComment,
  deleteBooks,
  findBook,
  deleteOneBook,
} = require("../DataBase/utilFuncs");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await listBooks();
      res.json(books);
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (title) {
        let book = await addBook(title);
        res.json(book);
      } else {
        res.send("missing required field title");
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      await deleteBooks();
      res.send("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let book = await findBook(bookid);
      if (book) res.json(book);
      else res.send("no book exists");
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      console.log(comment);
      if (!comment) res.send("missing required field comment");
      else {
        try {
          let book = await addComment(bookid, comment);
          res.json(book);
        } catch (err) {
          console.log("Error:" + err);
          res.json("no book exists");
        }
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        let result = await deleteOneBook(bookid);
        if (result.deletedCount == 0) res.send("no book exists");
        else res.send("delete successful");
      } catch (err) {
        console.log("Error:" + err);
      }
    });
};
