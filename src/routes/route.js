const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogscontroller=require("../controllers/blogsController")

router.post('/authors', authorController.createAuthor)
router.post('/blogs',blogscontroller.createBlogs)
router.get('/blogs',blogscontroller.allBlogs)

module.exports = router;