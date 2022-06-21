const AuthorModel = require("../models/authorModel");

const createAuthor = async function (req, res) {
  let author = req.body;
  let authorCreated = await AuthorModel.create(author);
  res.status(201).send({ data: authorCreated });
};

module.exports.createAuthor = createAuthor;
