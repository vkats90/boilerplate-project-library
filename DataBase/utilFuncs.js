const BookModel = require("./BookModel");

const errorHandle = (err) => {
  console.log("Your Error:" + err);
};

const listBooks = async () => {
  let books = await BookModel.find();
  return books;
};

const findBook = async (id) => {
  try {
    let book = await BookModel.findById({ _id: id });
    return book;
  } catch (err) {
    errorHandle(err);
  }
};

const addBook = async (name) => {
  let book = await BookModel.create({ title: name, commentcount: 0 });
  return book;
};

const addComment = async (id, comment) => {
  let book = await BookModel.findById({ _id: id });
  book.comments.push(comment);
  book.commentcount = book.comments.length;
  await book.save();
  return book;
};

const deleteBooks = async () => {
  await BookModel.deleteMany({ title: /\w/ });
};

const deleteOneBook = async (id) => {
  let result = BookModel.deleteOne({ _id: id });
  return result;
};

module.exports = {
  listBooks,
  addBook,
  addComment,
  deleteBooks,
  findBook,
  deleteOneBook,
};
