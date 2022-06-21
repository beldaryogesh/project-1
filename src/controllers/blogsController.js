const BlogsModel = require("../models/blogsModel")

const createBlogs = async function (req, res) {
    let blog = req.body

    let blogsCreated = await BlogsModel.create(blog)
    res.send({ data: blogsCreated })
}


module.exports.createBlogs= createBlogs