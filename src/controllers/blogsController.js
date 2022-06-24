const blogsModel = require("../models/blogsModel");
const authorModel = require("../models/authorModel");

const createBlogs = async function (req, res) {
  try {
    //edge Cases for createblogs according to Blog model and as per our requirements
    let blog = req.body;
    if (!blog) { res.status(400).send({ msg: "Blog body can't be empty" }) }

    if (!req.body.authorId)
      res.status(400).send({ status: false, msg: "AuthorID is required" });

    if (!req.body.title) { res.status(401).send({ msg: 'Title is required' }) };

    if (!req.body.body) { res.status(401).send({ msg: 'Body is required' }) };

    if (!req.body.category) { res.status(401).send({ msg: 'category is required' }) };

    if (!req.body.subcategory) { res.status(401).send({ msg: 'subcategory is required' }) };

    if (typeof req.body.title !== 'string') { res.status(401).send({ msg: 'title should be string type' }) };

    if (typeof req.body.body !== 'string') { res.status(401).send({ msg: 'body should be string type' }) };

    if (typeof req.body.category !== 'string') { res.status(401).send({ msg: 'category should be string type' }) };

    if (typeof req.body.subcategory !== 'string') { res.status(401).send({ msg: 'subcategory should be string type' }) };

    if (typeof req.body.tags !== 'string') { res.status(401).send({ msg: 'tags should be string type' }) };
    //TODO: check author id validation in authormodel 

    //After the passing all the edge cases now author can created his own new blogs
    let blogsCreated = await blogsModel.create(blog);
    res.status(201).send({ data: blogsCreated });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const allBlogs = async function (req, res) {
  try {
    //Possible edge cases and the rest is checked by authentication  
    let blogs = await blogsModel.find().select({ " isPublished": true, isDeleted: false });
    if (!blogs)
      res.status(400).send({ status: true, msg: "No Blogs are found" });
    else res.send({ data: blogs });

  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
//TODO:filterbyId part

const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
    let title = data.title;
    let body = data.body;
    let tags = data.tags;
    let subcategory = data.subcategory
    //here if we set the validation for all the required feild than author can'nt be update any individual feild at a time
    //Possible edge cases and the rest is checked by authentication and authorization

    if (!blogId) { res.status(400).send({ status: false, Msg: "BlogId is required" }) };

    if (!data) { res.status(400).send({ status: false, Msg: "Blog body can't be empty" }) };

    if (typeof req.body.title !== 'string') { res.status(401).send({ msg: 'title should be string type' }) };

    if (typeof req.body.body !== 'string') { res.status(401).send({ msg: 'body should be string type' }) };

    if (typeof req.body.subcategory !== 'string') { res.status(401).send({ msg: 'subcategory should be string type' }) };

    if (!blogId.ispublished == false) { res.status(400).send({ msg: "The blog is already published" }) }//check bcz via this syntax it can access the blogmodel
    //TODO:
    let publish = await blogsModel.find({ isDeleted: true })


    //after checking all the edge cases than the author can update his blogs

    let updateData = await blogsModel.findByIdAndUpdate({ _id: blogId }, { $set: { title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true, publishAt: Date.now() }, }, { new: true });
    if (!updateData == blogId) { res.status(400), send({ status: false, Msg: "BlogId does'nt exist" }) } //check
    res.status(201).send({ data: updateData });  //TODO:getting publishat in timestamps

  } catch (err) {
    console.log("this is the error", err);
    res.status(500).send({ error: err.message });
  }
};

const isDeleted = async function (req, res) {
  try {
    //Possible edge cases and the rest is checked by authentication and authorization
    let blogId = req.params.blogId;

    if (!blogId) { res.status(400).send({ status: false, Msg: "BlogId is requied" }) };

    let check = await blogsModel.find({ isDeleted: true })
    if (!check) res.status(400).send({ status: false, Msg: "Blog is already deleted" });

    //after checking all this validation author can delete his blogs 
    let updateData = await blogsModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
    if (!updateData == blogId) { res.status(400).send({ status: false, Msg: "BlogId does'nt match" }) } //if this thing not working than we need to do this individually and also doing same for update blog
    res.status(200).send({ data: updateData });

  } catch (err) {
    console.log("this is the error", err);
    res.status(500).send({ error: err.message });
  }
};


//TODO: adding 2-3 edge cases
const deleteBlogsQuery = async function (req, res) {
  try {
    //Possible edge cases and the rest is checked by authentication and authorization
    let data = req.query;
    let authorId = req.query.authorId;
    if (!authorId) { res.status(400).send({ status: false, Msg: "AuthorId is required" }) };
    if (!data) { res.status(400).send({ status: false, Msg: "Provide the details which you want to delete" }) };
    //   if(!data){if(!authorId){res.status(400).send({msg:"both data and author id not present in deleteblogsquery"})}}//edge case
    //     else{res.status(400).send({msg:"data is not present in deleteblogsquery"})}//edge case

    //edge case
    //   if (!data){res.status(400).send({ status: false, msg: "Data is not present" })};//edge case
    //   if(!data.isDeleted==false){res.status(400).send({msg:"data is already deleted in deleteblogsquery"})}//edge case

    //after checking all this validation author can delete his blogs 
    const deleteByQuery = await blogsModel.updateMany({ $and: [data, { isDeleted: false }] },
      { $set: { isDeleted: true, ispublished: false, isDeletedAt: Date.now() } }, { new: true });

    if (deleteByQuery.modifiedCount == 0)
      return res.status(400).send({ status: false, msg: "The Blog is already Deleted" });

    res.status(200).send({ status: true, msg: deleteByQuery });

  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.createBlogs = createBlogs;
module.exports.allBlogs = allBlogs;
module.exports.updateBlog = updateBlog;
module.exports.isDeleted = isDeleted;
module.exports.deleteBlogsQuery = deleteBlogsQuery;
