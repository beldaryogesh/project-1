const AuthorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
    //edge cases according to authormodel
    let author = req.body;
    let email = req.body.email
    let { ...blogData } = req.body;
    if (Object.keys(blogData).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "BlogData is required" });

    if (!req.body.fname) { res.status(400).send({ msg: "Please enter the fname" }) }

    if (!req.body.lname) { res.status(400).send({ msg: "Please enter the lname" }) }

    if (!req.body.title) { res.status(400).send({ msg: "Please enter the title" }) }

    if (!req.body.email) { res.status(400).send({ msg: "Please enter the email" }) }

    if (!req.body.password) { res.status(400).send({ msg: "Please enter the password" }) }

    let regName = /^[a-zA-Z ]{2,7}$/; //checking alphabet

    if (!regName.test(req.body.fname)) return res.status(400).send({ status: false, msg: "fname should be in alphabet" })
    if (!regName.test(req.body.lname)) return res.status(400).send({ status: false, msg: "lname should be in alphabet" })
  
  let emailId= await AuthorModel.findOne({email})
     if(!emailId){
    let authorCreated = await AuthorModel.create(author);
    res.status(201).send({ data: authorCreated })};
       res.status(400).send ({status:false,msg:"Email is already registerd"})
   
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
      return res.status(400).send({ status: false, msg: "Email and Password does'nt match", });

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
    res.status(201).send({ status: true, token: token });

  } catch (err) {
    console.log("This is the error", err);
    res.status(500).send({ error: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginUser = loginUser;
