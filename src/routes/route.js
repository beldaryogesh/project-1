const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogscontroller = require("../controllers/blogsController");
const comonMW = require("../middlewares/comonMW");

router.post("/authors", authorController.createAuthor);
router.post("/blogs", comonMW.authenticate, blogscontroller.createBlogs);
router.get("/blogs", comonMW.authenticate, blogscontroller.allBlogs);
router.get("/blog", comonMW.authenticate, blogscontroller.findById);
router.put("/blogs/:blogId", comonMW.authorisation, blogscontroller.updateBlog);
router.delete("/blog/:blogs", blogscontroller.isDeleted);
router.delete("/blogs", comonMW.authenticate, blogscontroller.deleteBlogsQuery);
router.post("/login", authorController.loginUser);

module.exports = router;
