const express = require('express');
const router = express.Router();


const authorController = require("../controllers/authorController")
const blogscontroller = require("../controllers/blogsController")
const commonMW = require('../middlewares/comonMW')


router.post('/authors', authorController.createAuthor)

router.post('/login', authorController.loginUser)

router.post('/blogs', commonMW.authenticate, blogscontroller.createBlogs)

router.get('/blogs', commonMW.authenticate, blogscontroller.allBlogs)

router.get('/blog', commonMW.authenticate, blogscontroller.FilterBlogs)//problem

router.put("/blogs/:blogId", commonMW.authorisation, blogscontroller.updateBlog)

router.delete('/blog/:blogId', commonMW.authorisation, blogscontroller.isDeletedByParam)

router.delete("/blogs", commonMW.authorisation, blogscontroller.deleteBlogsQuery)// problem


module.exports = router;
