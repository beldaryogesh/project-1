const blogsModel = require("../models/blogsModel");
const authorModel = require("../models/authorModel");

const createBlogs = async function (req, res) {
  try {
    //edge Cases for createblogs according to Blog model and as per our requirements

    let { ...blogData } = req.body;
    if (Object.keys(blogData).length == 0)
      return res.status(400).send({ status: false, msg: "BlogData is required" });
        
    if (!req.body.authorId)
      res.status(400).send({ status: false, msg: "AuthorID is required" });

    if (!req.body.title) { res.status(400).send({ msg: 'Title is required' }) };

    if (!req.body.body) { res.status(400).send({ msg: 'Body is required' }) };

    if (!req.body.category) { res.status(400).send({ msg: 'category is required' }) };

    if (!req.body.subcategory) { res.status(400).send({ msg: 'subcategory is required' }) };

    let regName = /^[a-zA-Z ]{2,7}$/; //checking alphabet
    if (!regName.test(req.body.title)) return res.status(400).send({ status: false, msg: "title should be in alphabet" })
    if (!regName.test(req.body.body)) return res.status(400).send({ status: false, msg: "body should be in alphabet" })

    //After the passing all the edge cases now author can created his own new blogs
    let blog = req.body;
  let checkauthorId = await authorModel.findById({_id: blogData.authorId} )
    if (!checkauthorId) {
      res.status(400).send({ status: false, msg: "Athorid does'nt exist" })
    };
    { 
      let blogCreated = await blogsModel.create(blog);
      res.status(201).send({ data: blogCreated })
    };
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
    let { ...blogData } = req.body;
    if (Object.keys(blogData).length == 0)
      return res.status(400).send({ status: false, msg: "BlogData is required" });

    let publish = await blogsModel.findById({ _id: blogId })
    if (!publish == true) res.status(400).send({ status: false, Msg:"BlogId does'nt exist"})


    //after checking all the edge cases than the author can update his blogs

    let updateData = await blogsModel.findByIdAndUpdate({ _id: blogId }, { $set: { title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true, publishAt: Date.now() }, }, { new: true });
    res.status(201).send({ data: updateData }); 

  } catch (err) {
    console.log("this is the error", err);
    res.status(500).send({ error: err.message });
  }
};

const isDeleted = async function (req, res) {
  try {
    //Possible edge cases and the rest is checked by authentication and authorization
    let blogId = req.params.blogId;

    let check = await blogsModel.find({ isDeleted: true })
    if (check) res.status(400).send({ status: false, Msg: "Blog is already deleted" });

    let check2 = await blogsModel.findById({ _id: blogId })
    if (!check2== blogId) { res.status(400).send({ status: false, Msg: "BlogId does'nt match" }) }

    //after checking all this validation author can delete his blogs 
    let updateData = await blogsModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
    res.status(200).send({ data: updateData });

  } catch (err) {
    console.log("this is the error", err);
    res.status(500).send({ error: err.message });
  }
};


const deleteBlogsQuery = async function (req, res) {
  try {
    //Possible edge cases and the rest is checked by authentication and authorization
    let data = req.query;
    let authorId = req.query.authorId;
    if (!authorId) { res.status(400).send({ status: false, Msg: "AuthorId is required" }) };
    if (!data) { res.status(400).send({ status: false, Msg: "Provide the details which you want to delete" }) };

    //after checking all this validation author can delete his blogs 
    const check3 = await blogsModel.find({ authorId:authorId  })
     if(!check3==authorId) res.status(400).send({status:false,msg:"author does'nt match"});

    const deleteByQuery = await blogsModel.updateMany({ $and: [data, { isDeleted: false }] },
      { $set: { isDeleted: true, ispublished: false, isDeletedAt: Date.now() } }, { new: true })

    if (deleteByQuery.modifiedCount == 0)
      return res.status(400).send({ status: false, msg: "The Blog is already Deleted" })

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
