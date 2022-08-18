const express = require('express');
const router = express.Router();


const authorController = require("../controllers/authorController")
 const blogscontroller = require("../controllers/blogsController")
// const commonMW = require('../middlewares/comonMW')


router.post('/authors', authorController.createAuthor)

router.post('/login', authorController.loginUser)

router.post('/blogs', blogscontroller.createBlogs)

router.get('/blogs',  blogscontroller.getBlogs)

 router.put("/blogs/:blogId", blogscontroller.updateBlog)

 router.delete('/blogs/:blogId', blogscontroller.DeleteBlogsByParam)

 router.delete("/blogs",  blogscontroller.deleteBlogsQuery)


module.exports = router;
