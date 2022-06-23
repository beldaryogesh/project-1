const jwt = require("jsonwebtoken");
const authenticate = function(req, res, next) {
try{
    let token = req.headers["x-auth-token"];

  if (!token) token = req.headers["x-auth-token"];
  if (!token) return res.send({ status: false, msg: "token must be present" });

  let decodedToken = jwt.verify(token, "functionup-radon");

  if (!decodedToken)
    return res.send({ status: false, msg: "token is invalid" });
    req.decodedToken=decodedToken
    next()
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
}

module.exports.authenticate=authenticate
