const mongoose = require("mongoose");
const blogsModel = require("../models/blogsModel");
const authorModel = require("../models/authorModel");
const { isValidObjectId } = require('mongoose')
const { isValidRequestBody, isValid } = require("../middlewares/validation");

const createBlogs = async function (req, res) {
  try {
    let data = req.body;
    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, msg: "Please provide your Blog details in body" })
    };
    let { authorId, title, body, category, subcategory, tags } = data

    if (!isValid(authorId)) {
      return res.status(400).send({ status: false, msg: "please provide quthorId" })
    }
    if (!isValidObjectId(authorId)) {
      return res.status(400).send({ status: false, msg: "please provide valid authorId" });
    }
    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "please provide title" })
    };

    if (!isValid(body)) {
      return res.status(400).send({ status: false, msg: "please provide body" })
    };

    if (!isValid(category)) {
      return res.status(400).send({ status: false, msg: "please provide category" })
    };

    if (!isValid(subcategory)) {
      return res.status(400).send({ status: false, msg: "please provide subcategory" })
    };
    if (tags !== undefined) {
      if (!isValid(tags)) {
        return res.status(400).send({ status: false, msg: "please provide tags" })
      };
    }

    let blogCreated = await blogsModel.create(data);
    { return res.status(201).send({ status: true, message: "successfully", data: blogCreated }) };


  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

const getBlogs = async function (req, res) {
  try {
    let data = req.query
    const { authorId, tags, category, subcategory } = data
    if (authorId !== undefined) {
      if (!isValid(authorId)) {
        return res.status(400).send({ status: false, msg: "please provide authorId" })
      }
      if (!isValidObjectId(authorId)) {
        return res.status(400).send({ status: false, msg: "please provide valid authorId" });
      }
      let CheckAuthorId = await authorModel.findById({ _id: authorId })
      if (!CheckAuthorId) {
        return res.status(404).send({ status: false, msg: "AuthorId is not exist in database" })
      }
      let blogData = await blogsModel.find({ authorId: authorId, isPublished: true, isDeleted: false })
      if (blogData.length == 0) {
        return res.status(404).send({ status: false, msg: "No such Blogs are found for this authorId" })
      }
      else {
        return res.status(200).send({ data: blogData })
      }
    }
    else if (tags !== undefined) {
      if (!isValid(tags)) {
        return res.status(400).send({ status: false, msg: "please provide tags" })
      }
      let checkTags = await blogsModel.find({ tags: tags, isPublished: true, isDeleted: false })
      if (checkTags.length == 0) { return res.status(404).send({ status: false, msg: "No such similar blogs are find by thes tag" }) }
      else {
        return res.status(200).send({ status: true, data: checkTags })
      }
    }

    else if (category !== undefined) {
      if (!isValid(category)) {
        return res.status(400).send({ status: false, msg: "please provide category" })
      }
      let checkCategory = await blogsModel.find({ category: category, isPublished: true, isDeleted: false })
      if (checkCategory.length == 0) {
        return res.status(404).send({ status: false, msg: "No such similar blogs are find by the category" })
      }
      else {
        return res.status(200).send({ status: true, data: checkCategory })
      };

    } else if (subcategory !== undefined) {
      if (!isValid(subcategory)) {
        return res.status(400).send({ status: false, msg: "please provide subcategory" })
      }
      let checkSubcategory = await blogsModel.find({ subcategory: subcategory, isPublished: true, isDeleted: false })
      if (checkSubcategory.length == 0) {
        return res.status(404).send({ status: false, msg: "No such similar blogs are find by the subcategory" })
      }
      else {
        return res.status(200).send({ data: checkSubcategory })
      };
    } else {
      return res.status(400).send({ status: false, msg: "Please provide the details in query params which you want to see" })
    }
  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ status: false, msg: "please provide valid blogId" });
    }
    let checkBlogId = await blogsModel.findById({ _id: blogId })
    if (!checkBlogId) {
      return res.status(404).send({ status: false, Msg: "BlogId is not exist" })
    }
    if (!isValidRequestBody(data)) {
      return res.status(404).send({ status: false, msg: "Please provide which feild you want to update" })
    };

    const { title, body, tags, subcategory } = data
    let newObj = {}
    if (title !== undefined) {
      if (!isValid(title)) {
        return res.status(400).send({ status: false, msg: "please provide title for update" })
      }
      newObj["title"] = title
    }
    if (body !== undefined) {
      if (!isValid(body)) {
        return res.status(400).send({ status: false, msg: "please provide body for update" })
      }
      newObj["body"] = body
    }
    if (tags !== undefined) {
      if (!isValid(tags)) {
        return res.status(400).send({ status: false, msg: "please provide tags for update" })
      }
      newObj["tags"] = tags
    }
    if (subcategory !== undefined) {
      if (!isValid(subcategory)) {
        return res.status(400).send({ status: false, msg: "please provide subcategory for update" })
      }
      newObj["subcategory"] = subcategory
    }

    let isDeletedCheck = await blogsModel.findOne({ _id: blogId, isDeleted: true })
    if (isDeletedCheck) {
      return res.status(404).send({ status: false, Msg: "Blog is already deleted" })
    }
    let updateData = await blogsModel.findByIdAndUpdate({ _id: blogId },
      { $set: newObj, isPublished: true, publishAt: new Date() },//{isPublished: true, publishAt: new Date()},
      { new: true })
    {
      return res.status(200).send({ status: true, data: updateData })
    };

  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

const DeleteBlogsByParam = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ status: false, msg: "please provide valid blogId" });
    }
    let checkBlogId = await blogsModel.findOne({ _id: blogId, })
    if (!checkBlogId) {
      return res.status(404).send({ status: false, Msg: "BlogId is not exist in the database " })
    }
    if (checkBlogId.isDeleted === true)
      return res.status(400).send({ status: false, message: "This blog has already been deleted." })
    let updateData = await blogsModel.findOneAndUpdate({ _id: blogId },
      {
        $set: {
          isDeleted: true,
          isPublished: false,
          deletedAt: new Date()
        }
      },
      { new: true });
    {
      return res.status(200).send({ status: true, message: "blog delete successfully" })
    };

  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

const deleteBlogsQuery = async function (req, res) {
  try {
    //Possible edge cases and the rest is checked by authentication and authorization
    let data = req.query;
    if (!isValidRequestBody(data)) {
      return res.status(404).send({ status: false, msg: "Please provide the details in query params which you want to delete" })
    }
    const { authorId, tags, category, subcategory } = data
    //after checking all this validation author can delete his blogs 
    if (authorId !== undefined) {
      if (!isValid(authorId)) {
        return res.status(400).send({ status: false, msg: "please provide authorId for delete a blog" })
      }
      if (!isValidObjectId(authorId)) {
        return res.status(400).send({ status: false, msg: "please provide valid authorId" });
      }
      const checkAuthorId = await authorModel.findById({ _id: authorId })
      if (!checkAuthorId) {
        return res.status(404).send({ status: false, msg: "Author is not exist" });
      }
      let authorData = await blogsModel.find({ authorId: checkAuthorId, isDeleted: false })
      if (authorData.length == 0) {
        return res.status(404).send({ status: false, msg: "No blogs found for this author" })
      };

      let updateData = await blogsModel.findOneAndUpdate({ authorId: checkAuthorId, isDeleted: false, isPublished: true },
        {
          $set: {
            isDeleted: true,
            isPublished: false,
            isDeletedAt: new Date()
          }
        },
        { new: true })
      { return res.status(200).send({ status: true, msg: "All Blogs deleted successfully for this authorId" }) }

    }
    else if (data.tags) {
      let tagsData = await blogsModel.find({
        tags: tags,
        isDeleted: false,
        isPublished: true
      })
      if (tagsData.length == 0) {
        return res.status(404).send({ status: false, msg: "Nothing to delete,all blogs are already deleted for this particular tag" })
      };

      let tData = await blogsModel.updateMany({ tags: tags, isDeleted: false },
        {
          $set: {
            isDeleted: true,
            isPublished: false,
            isDeletedAt: new Date()
          }
        },
        { new: true });
      { return res.status(200).send({ status: true, msg: "All Blogs deleted successfully for this particular tag" }) }

    }
    else if (data.category) {
      let catData = await blogsModel.find({
         category: data.category,
          isDeleted: false,
          })
      if (catData.length == 0) { 
        return res.status(404).send({ status: false, msg: "Nothing to delete,all blogs are already deleted for this category" }) };

      let cData = await blogsModel.updateMany({
         category: data.category,
          isDeleted: false, 
          isPublished: true 
        }, 
        { $set: {
           isDeleted: true,
            isPublished: false,
             isDeletedAt: new Date()
             } 
            }, { new: true });
      { return res.status(200).send({ status: true, msg: "All Blogs deleted successfully for this category" }) }
    }
    else if (data.subcategory) {
      let subcatData = await blogsModel.find({ 
        subcategory: data.subcategory, 
        isDeleted: false, 
        isPublished: true 
      })
      if (subcatData.length == 0) {
         return res.status(404).send({ status: false, msg: "Nothing to delete,all blogs are already deleted for this subcategory" }) };

      let sData = await blogsModel.updateMany({
         subcategory: data.subcategory, 
         isDeleted: false, 
         isPublished: true 
        }, 
        { $set: { isDeleted: true, isPublished: false, isDeletedAt: new Date() } }, { new: true });
      { return res.status(200).send({ status: true, msg: "All Blogs deleted successfully for this subcategory" }) }

    } 
    else {
      return res.status(404).send({ status: false, msg: "Please provide the details in query params which you want to delete" })
    }

  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = { createBlogs, getBlogs, updateBlog, DeleteBlogsByParam, deleteBlogsQuery };
