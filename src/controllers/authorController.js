const AuthorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
    let author = req.body;
    if(req.body.length<0){res.status(401).send({msg:"body cant be empty"})}
    if (!author){ res.status(400).send({ status: false, msg: "Author is not there" })};//edge cases according to authormodel
    if(typeof req.body.fname !== 'string'){res.status(401).send({msg:'first name should be string type'})}
    if(typeof req.body.lname !== 'string'){res.status(401).send({msg:'last name should be string type'})}
    if(typeof req.body.password !== 'string'){res.status(401).send({msg:'password should be string type'})}
    if(typeof req.body.title !== 'string'){res.status(401).send({msg:'gender should be string type'})}
    if(!req.body.fname){res.status(401).send({msg:"first name not entered"})}
    if(!req.body.lname){res.status(401).send({msg:"last name not entered"})}
    if(!req.body.title){res.status(401).send({msg:"author title not entered"})}
    if(!req.body.email){res.status(401).send({msg:"emailId not entered"})}
    if(!req.body.password){res.status(401).send({msg:"password not entered"})}
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
    //edge case for authorname and pasword===========================================================
    if(!authorName){
      if(!password){
        res.status(400).send({msg:"body cant be empty"})
      }
     else{ res.status(400).send({msg:"Authorname cant be empty"})
    }}
    if(!password){
      res.status(400).send({msg:"pasword cant be empty"})
    }
    //===================================================================================
    let author = await AuthorModel.findOne({
      emailId: authorName,
      password: password,
    });
    if (!author)
      return res.send({
        status: false,
        msg: "Authorname or the password is not corerct",
      });
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
   }catch (err) {
    console.log("this is the error", err);
    res.status(500).send({ error: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginUser = loginUser;
