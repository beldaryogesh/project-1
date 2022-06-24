const express = require('express');
const router = express.Router();


const authorController = require("../controllers/authorController")
const blogscontroller = require("../controllers/blogsController")
const commonMW = require('../middlewares/comonMW')


router.post('/authors', authorController.createAuthor)//working

router.post('/login', authorController.loginUser)//working

router.post('/blogs', commonMW.authenticate, blogscontroller.createBlogs)//working

router.get('/blogs', commonMW.authenticate, blogscontroller.allBlogs)//find filter is not a function

router.put("/blogs/:blogId", commonMW.authorisation, blogscontroller.updateBlog) //working

router.delete('/blog/:blogId', commonMW.authorisation, blogscontroller.isDeleted)//working only adding 2-3 edge cases

router.delete("/blogs", commonMW.authorisation, blogscontroller.deleteBlogsQuery)// not checked properlyand also adding some edge cases 


module.exports = router;
