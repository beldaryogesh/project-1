const blogsModel = require("../models/blogsModel");
const BlogsModel = require("../models/blogsModel");
const authorModel = require("../models/authorModel");

const createBlogs = async function (req, res) {
  try {
    let blog = req.body;
    if(!blog){res.status(400).send({msg:"Blog is not present"})}//edge case
    let authorId = req.body.authorId;
    if (!authorId)
      res.status(400).send({ status: false, msg: "Author doesnt exist" });//edge Cases for tje schema of blof model
      if(!req.body.title){res.status(401).send({msg:'title is required'})}//
      if(!req.body.body){res.status(401).send({msg:'body is required'})}//
      if(!req.body.category){res.status(401).send({msg:'category is required'})}//
      if(!req.body.subcategory){res.status(401).send({msg:'subcategory is required'})}//
      if(typeof req.body.title !== 'string'){res.status(401).send({msg:'title should be string type'})}//
      if(typeof req.body.body !== 'string'){res.status(401).send({msg:'body should be string type'})}//
      if(typeof req.body.category !== 'string'){res.status(401).send({msg:'category should be string type'})}//
      if(typeof req.body.subcategory !== 'string'){res.status(401).send({msg:'subcategory should be string type'})}//
      if(typeof req.body.tags !== 'string'){res.status(401).send({msg:'tags should be string type'})}//edge cases


   
    let blogsCreated = await BlogsModel.create(blog);
    res.status(201).send({ data: blogsCreated });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const allBlogs = async function (req, res) {
  try {
    
    let blogs = await blogsModel
      .find()
      .select({ " isPublished": true, isDeleted: false });
    if (!blogs)
      res.status(400).send({ status: true, msg: "No Blogs are found" });
    else res.send({ data: blogs });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body; 
    if (!blogId)
      res.status(400).send({ status: false, Msg: "BlogId is not present" });//edge case
      if (!data)
      res.status(400).send({ status: false, Msg: "Input data is not found" });//edge case
      if(!blogId.ispublished==false){res.status(400).send({msg:"cannot accept isPublished as already true"})}//edge case

  let updateData = await blogsModel.findByIdAndUpdate({ _id: blogId },{ $set: { title: data.title, body: data.body, tags:data.tags,subcategory:data.subcategory ,isPublished: true,publishAt: Date.now()}, },{ new: true }  );
    res.status(201).send({ data: updateData });  //getting publishat in timestamps
  } catch (err) {
    console.log("this is the error", err);
    res.status(500).send({ error: err.message });
  }
};

const isDeleted = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
      if (!blogId)
      res.status(400).send({ status: false, Msg: "BlogId is not present" });//edge case
       if (!data){res.status(400).send({ status: false, Msg: "Input data not found" })};//edge case
     // if(!blogId.isdeleted==false){res.status(400).send({msg:"data already deleted"})}//edge case
    //  if(!blogId.isPublished==true){res.status(400).send({msg:"cannot delete data that is not published"})}//edge case
    // let check = await blogsModel.find({ispublished:true} &&{isDeleted:true})    //add edge cases here
    // if (!check) res.status(400).send({status:false,Msg:""})
    let updateData = await blogsModel.findOneAndUpdate({_id:blogId},{ $set: { isDeleted: true, deletedAt: Date.now() } },{ new: true });
    res.status(200).send({ data: updateData });
  } catch (err) {
    console.log("this is the error", err);
    res.status(500).send({ error: err.message });
  }
};

const deleteBlogsQuery = async function (req, res) {
  try {
   let data = req.query;
     let authorId = req.query.authorId;
  //   if(!data){if(!authorId){res.status(400).send({msg:"both data and author id not present in deleteblogsquery"})}}//edge case
  //     else{res.status(400).send({msg:"data is not present in deleteblogsquery"})}//edge case
    
    if (!authorId){ res.status(400).send({ status: false, Msg: "No such authors exists" })};//edge case
  //   if (!data){res.status(400).send({ status: false, msg: "Data is not present" })};//edge case
  //   if(!data.isDeleted==false){res.status(400).send({msg:"data is already deleted in deleteblogsquery"})}//edge case
    
    const deleteByQuery = await blogsModel.updateMany({ $and: [data, { isDeleted: false }] },
     { $set: { isDeleted: true,ispublished:false, isDeletedAt: Date.now() } },{ new: true });
    if (deleteByQuery.modifiedCount == 0)
      return res.status(400).send({ status: false, msg: "The Blog is already Deleted" });

    res.status(200).send({ status: true, msg: deleteByQuery });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.createBlogs = createBlogs;
module.exports.allBlogs = allBlogs;
module.exports.updateBlog = updateBlog;
module.exports.isDeleted = isDeleted;
module.exports.deleteBlogsQuery = deleteBlogsQuery;
