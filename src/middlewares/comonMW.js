const jwt = require("jsonwebtoken");
const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-auth-token"];

    if (!token) token = req.headers["x-auth-token"];
    if (!token) return res.send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "functionup-radon");

    if (!decodedToken)
      return res.send({ status: false, msg: "token is invalid" });
    req.decodedToken = decodedToken
    next()
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
}

const authorisation = function (req, res, next) {
  try {
    token = req.headers["x-auth-token"]
    console.log(token)
    let blog_Id = req.params.blogId
    let userId = decodedToken.userId
    let data = req.query;
    if (blog_Id.authorId == userId) {
      if (blog_Id) {
        if (!mongoose.isValidObjectId(blog_Id)) return res.status(400).send({ status: false, msg: "Enter a Valid BlogId" })
        let authorData = await blogModel.findOne({ _id: blog_Id, authorId: userId })
        if (!authorData) return res.send({ status: false, msg: "you are not authorized" })
      }

      if (data.authorId) {
        if (!mongoose.isValidObjectId(data.authorId)) return res.status(400).send({ status: false, msg: "Enter a Valid authorId" })
        if (data.authorId != userId) return res.send({ status: false, msg: "you are not authorized" })
      }


      if (data.category) {
        let authorData = await blogModel.find({ category: data.category, authorId: userId })
        if (!authorData.length) return res.send({ status: false, msg: "you are not authorized" })
      }

      if (data.subcategory) {
        let authorData = await blogModel.find({ subcategory: data.subcategory, authorId: userId })
        if (!authorData.length) return res.send({ status: false, msg: "you are not authorized" })
      }

      if (data.tags) {
        let authorData = await blogModel.find({ tags: data.tags, authorId: userId })
        if (!authorData.length) return res.send({ status: false, msg: "you are not authorized" })
      }

      if (data.isPublished) {
        let authorData = await blogModel.find({ isPublished: data.isPublished, authorId: userId })
        if (!authorData.length) return res.send({ status: false, msg: "you are not authorized" })
      }

      next()
    }
  }

  catch (error) {

    res.status(500).send(error.message)

  }
}

module.exports.authorisation = authorisation

module.exports.authenticate = authenticate
