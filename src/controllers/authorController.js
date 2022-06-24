const AuthorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
    //edge cases according to authormodel

    if (req.body.length < 0) { res.status(401).send({ msg: "Body cant be empty" }) }

    if (!author) { res.status(400).send({ status: false, msg: "Author is not there" }) }; //check

    if (typeof req.body.fname !== 'string') { res.status(401).send({ msg: 'first name should be string type' }) }

    if (typeof req.body.lname !== 'string') { res.status(401).send({ msg: 'last name should be string type' }) }

    if (typeof req.body.password !== 'string') { res.status(401).send({ msg: 'Password should be string type' }) }

    if (typeof req.body.title !== 'string') { res.status(401).send({ msg: 'Gender should be string type' }) }

    if (!req.body.fname) { res.status(401).send({ msg: "Please enter the fname" }) }

    if (!req.body.lname) { res.status(401).send({ msg: "Please enter the lname" }) }

    if (!req.body.title) { res.status(401).send({ msg: "Please enter the title" }) }

    if (!req.body.email) { res.status(401).send({ msg: "Please enter the email" }) }

    if (!req.body.password) { res.status(401).send({ msg: "Please enter the password" }) }

    //after checking all edge cases than author can register his details
    let author = req.body;
    let authorCreated = await AuthorModel.create(author);
    res.status(201).send({ data: authorCreated });

  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const loginUser = async function (req, res) {
  try {
    let authorName = req.body.email;
    let password = req.body.password;
    //edge case for authorname and pasword
    //checking body and email-password must be present 
    if (!authorName) {
      if (!password) {
        res.status(400).send({ msg: "Body can't be empty" })
      }
      else {
        res.status(400).send({ msg: "Please enter the email" }) //changes
      }
    }
    if (!password) {
      res.status(400).send({ msg: "Please enter the password" }) //changes
    }

    //checking both feilds are matched or not
    let author = await AuthorModel.findOne({ emailId: authorName, password: password, });
    if (!author)
      return res.send({ status: false, msg: "Email and Password does'nt match", });

    //After checking all edge cases ... now creating token
    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "radon",
        organisation: "FunctionUp",
      },
      "functionup-radon"
    );
    res.setHeader("x-api-key", token);
    res.send({ status: true, token: token });

  } catch (err) {
    console.log("This is the error", err);
    res.status(500).send({ error: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginUser = loginUser;
