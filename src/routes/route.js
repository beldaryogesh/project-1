const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogscontroller=require("../controllers/blogsController")

router.post('/authors', authorController.createAuthor)
router.post('/blogs',blogscontroller.createBlogs)
router.get('/blogs',blogscontroller.allBlogs)
router.get('/blog',blogscontroller.findById)
router.put("/blogs/:blogId", blogscontroller.updateBlog)
module.exports = router;