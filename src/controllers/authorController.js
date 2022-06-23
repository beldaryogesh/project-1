const AuthorModel = require("../models/authorModel");

const createAuthor = async function (req, res) {
  try{
  let author = req.body;
   //let (!) (res.status(400).send({status:false,msg:""})) //add for each attribute(like fname,lname)
  if (!author)res.status(400).send({status:false,msg:"Author is not there"})
  let authorCreated = await AuthorModel.create(author);
  res.status(201).send({ data: authorCreated });
} catch (err) {
  console.log("This is the error :", err.message);
  res.status(500).send({ msg: "Error", error: err.message });
}
};

const loginUser = async function (req, res) {
  try{ 
  let authorName = req.body.emailId;
  let password = req.body.password;

  let author = await AuthorModel.findOne({ emailId: authorName, password: password });
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
  res.setHeader("x-auth-token", token);
  res.send({ status: true, token: token });
}
catch (err) {
  console.log("this is the error", err)
  res.status(500).send({ error: err.message })
}
};

module.exports.createAuthor = createAuthor;
module.exports.loginUser=loginUser
