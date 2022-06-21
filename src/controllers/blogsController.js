const BlogsModel = require("../models/blogsModel")

const createBlogs = async function (req, res) {
    let blog = req.body
    let authorId= req.body.authorId
    if(!authorId) res.status(400).send({status:false,msg:"Author is not present"})
    let blogsCreated = await BlogsModel.create(blog)
    res.status(201).send({ data: blogsCreated })
}


module.exports.createBlogs= createBlogs