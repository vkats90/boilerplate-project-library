const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  commentcount: Number,
  comments: [String],
});

module.exports = mongoose.models.Issue || mongoose.model("Book", BookSchema);
