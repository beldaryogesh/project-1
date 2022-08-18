const AuthorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const { isValid, isValidRequestBody, nameRegex, emailRegex, passRegex, enumTitle } = require("../middlewares/validation");
const authorModel = require("../models/authorModel");

//**************************************createAuthor************************************************************ */
const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, msg: "Please provide your author details in body" })
    };

    let { fname, lname, title, email, password, } = data
    //---------------------------------fname validation--------------------------------------//
    if (!isValid(fname)) {
      return res.status(400).send({ status: false, msg: "Please provide the fname" })
    }
    if (!nameRegex.test(fname))
      return res.status(400).send({ status: false, message: "fname should contain alphabets only." })
    //---------------------------------lname validation--------------------------------------//
    if (!isValid(lname)) {
      return res.status(400).send({ status: false, msg: "Please provide the lname" })
    }
    if (!nameRegex.test(lname))
      return res.status(400).send({ status: false, message: "lname should contain alphabets only." })
    //---------------------------------title validation--------------------------------------//
    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "Please provide the title" })
    }
    if (!enumTitle.test(title)) {
      return res.status(400).send({ status: false, msg: "Please provide only Mr, Mrs ,Miss title" })
    }
    //---------------------------------email validation--------------------------------------//
    if (!isValid(email)) {
      return res.status(400).send({ status: false, msg: "Please provide the email" })
    }
    if (!emailRegex.test(email))
      return res.status(400).send({ status: false, message: "Please enter a valid emailId." })
    let getEmail = await authorModel.findOne({ email: email });
    if (getEmail) {
      return res.status(400).send({ status: false, message: "Email is already in use, please enter a new one." });
    }
    //---------------------------------password validation--------------------------------------//
    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: "Please provide the password" })
    }
    if (!passRegex.test(password))
      return res.status(400).send({ status: false, message: "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character." })
    //---------------------------------create data--------------------------------------//
    let authorCreated = await authorModel.create(data);
    return res.status(201).send({ status: true, message: "author registered successfully", data: authorCreated, })
  }
  catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

//**************************************loginUser**************************************************************** */

const loginUser = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let data = req.body;
    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, msg: "Please provide your login details in body" })
    };
    //---------------------------------email validation--------------------------------------//
    if (!isValid(email)) {
      return res.status(400).send({ status: false, msg: "Please provide the email" })
    }
    if (!emailRegex.test(email))
      return res.status(400).send({ status: false, message: "Please enter a valid emailId." })
    let getEmail = await authorModel.findOne({ email: email });
    if (!getEmail) {
      return res.status(400).send({ status: false, message: "email is not exist in the database." });
    }
    //---------------------------------password validation--------------------------------------//
    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: "Please provide the password" })
    }
    if (!passRegex.test(password))
      return res.status(400).send({ status: false, message: "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character." })

    let author = await AuthorModel.findOne({ email: email, password: password, });
    if (!author)
      return res.status(400).send({ status: false, msg: "Email and Password is not correct", });

    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "radon",
        organisation: "FunctionUp",
      },
      "functionup-radon"
    );
    { res.setHeader("x-api-key", token) };
    { return res.status(201).send({ status: true,message: "successfully", token: token }) };

  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

module.exports = { createAuthor, loginUser }