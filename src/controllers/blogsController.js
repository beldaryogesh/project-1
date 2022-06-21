const blogsModel = require("../models/blogsModel");
const BlogsModel = require("../models/blogsModel");

const createBlogs = async function (req, res) {
  try {
    let blog = req.body;
    let authorId = req.body.authorId;
    if (!authorId)
      res.status(400).send({ status: false, msg: "Author is not present" });
    let blogsCreated = await BlogsModel.create(blog);
    res.status(201).send({ data: blogsCreated });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const allBlogs = async function (req, res) {
  try {
    let blogs = await blogsModel.find().select({ " isPublished": false, isDeleted: false });
    if (!blogs) res.status(400).send({ status: true, msg: "No Blogs are found" });
    else res.send({ data: blogs });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const findById= async function (req,res){
    try{
    let authorId= req.query.authorId
    let category=req.query.category
    if(!authorId) res.status(400).send({status:false,msg:"authorId inavalid"})
    let particularBlog= await blogsModel.find().select({category:category, authorId:authorId})
    if(!particularBlog) res.status(400).send({status:false, msg:"NO Blogs are Found"})
    res.send({data:particularBlog})
} catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
}

module.exports.createBlogs = createBlogs;
module.exports.allBlogs = allBlogs;
module.exports.findById=findById