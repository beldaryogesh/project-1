const blogsModel = require("../models/blogsModel");
const BlogsModel = require("../models/blogsModel");
const authorModel = require("../controllers/authorController")


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
//******************************************************************************************* */

const allBlogs = async function (req, res) {
  try {
    let blogs = await blogsModel.find().select({ " isPublished": false, isDeleted: false });
    if (!blogs)
      res.status(400).send({ status: true, msg: "No Blogs are found" });
    else res.send({ data: blogs });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
//********************************************************************************************** */

const findById = async function (req, res) {
  try {
    let authorId = req.query.authorId;
    let category = req.query.category;
    if (!authorId)
      res.status(400).send({ status: false, msg: "authorId inavalid" });
    let particularBlog = await blogsModel.find().select({ category: category, authorId: authorId });
    if (!particularBlog)
      res.status(400).send({ status: false, msg: "NO Blogs are Found" });
    res.send({ data: particularBlog });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
//**************************************************************************************************** */
const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body
    if (!blogId) res.status(400).send({ status: false, Msg: "BlogId is not there" })
    if (!data) res.status(400).send({ status: false, Msg: "Input data not found" })
    let updateData = await blogsModel.findByIdAndUpdate({ _id: blogId }, { $set: { "title": data.title, "body": data.body }, "isPublished": true, "publishAt": Date.now() }, { new: true })
    res.status(201).send({ data: updateData })
  }
  catch (err) {
    console.log("this is the error", err)
    res.status(500).send({ error: err.message })
  }
}
//******************************************************************************************* */
//const deleteBlogsQuery = async function (req, res) {
// try {
// let authorId = req.query.authorId;
// let tags = req.query.tag;
// let category = req.query.category;
// let subCategory = req.query.subCategory;
// let isPublished = req.query.isPublished;
// let arr = []
// let blog = await blogsModel.find({authorId : authorId, tags : tags, category : category, subCategory : subCategory, isPublished : isPublished })

// if(!blog) {
//   return res.status(404).send({status : false, msg : "blog not found"})
// }

// arr.push(blog)
// res.status(404).send({msg : err.message})

// }
// catch (err) {
//   console.log("this is the error", err)
//   res.status(500).send({ error: err.message })
// }
// }


const deleteBlogsQuery = async function (req, res) {
  try {

    let data = req.query; 
console.log(data)
      const deleteByQuery = await blogsModel.updateMany({ $and: [data, { isDeleted: false }] },{ $set: { isDeleted: true ,DeletedAt:new Date()} },{ new: true })
      if (deleteByQuery.modifiedCount==0) return res.status(400).send({ status: false, msg: "The Blog is already Deleted" })

      res.status(200).send({ status: true, msg: deleteByQuery })
  }

  catch (err) {

    res.status(500).send({ error: err.message })

  }
}



module.exports.createBlogs = createBlogs;
module.exports.allBlogs = allBlogs;
module.exports.findById = findById;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlogsQuery = deleteBlogsQuery;
