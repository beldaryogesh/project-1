const jwt = require("jsonwebtoken");
const blogsModel = require("../models/blogsModel");
const authenticate = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    console.log(token);

    if (!token) token = req.headers["x-api-key"];
    if (!token)
      return res.send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "functionup-radon");

    if (!decodedToken)
      return res.send({ status: false, msg: "token is invalid" });
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const authorisation = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    console.log(token);

    if (!token) token = req.headers["x-api-key"];
    if (!token)
      return res.send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "functionup-radon");

    if (!decodedToken)
      return res.send({ status: false, msg: "token is invalid" });
    req.decodedToken = decodedToken;

    let modifyAuthor = req.params.authorId||req.headers.authorId;
    let loggedUser = decodedToken.userId;
    if (modifyAuthor !== loggedUser) {
      return res.send({ status: false, msg: "Modified Author must be logged user" });
    }
    // res.status(200).send({msg:"authorisation successful"})
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports.authorisation = authorisation;

module.exports.authenticate = authenticate;
