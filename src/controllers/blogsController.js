const blogsModel = require("../models/blogsModel");
const BlogsModel = require("../models/blogsModel");

const createBlogs = async function (req, res) {
  let blog = req.body;
  let authorId = req.body.authorId;
  if (!authorId)
    res.status(400).send({ status: false, msg: "Author is not present" });
  let blogsCreated = await BlogsModel.create(blog);
  res.status(201).send({ data: blogsCreated });
};

const allBlogs= async function (req, res){
    let blogs= await blogsModel.find().select({" isPublished": false,"isDeleted":false})
    if(!blogs) res.send({status:true,msg:"No Blogs are found"})
    else res.send({data: blogs})
}

module.exports.createBlogs = createBlogs;
module.exports.allBlogs=allBlogs