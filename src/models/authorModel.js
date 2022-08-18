const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    fname: {
      type: String,
      required: true,
      trim: true
    },
    lname: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      trim: true,
      enum: ["Mr", "Mrs", "Miss"],
      required: true
    },
    email: {
      require: true,
      type: String,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
  }, 
  { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);