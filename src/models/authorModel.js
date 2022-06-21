const mongoose = require("mongoose");
const validator = require("validator");

const authorSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    title: { type: String, enum: [Mr, Mrs, Miss], required: true },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (value) {
          return value === "correct@example.com";
        },
        message: "Invalid email.",
      },
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
