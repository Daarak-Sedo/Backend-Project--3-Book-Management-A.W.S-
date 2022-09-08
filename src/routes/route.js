const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const auth = require("../middleware/auth");

//______________________________post api (author creation)__________________________________>>>
router.post("/author", authorController.createAuthor);

//_______________________________post api for login aouthor ________________________________>>>
router.post("/loginAuthor", authorController.loginAuthor);

//______________________________post api (blog creation)_____________________________________>>>
router.post("/blog", blogController.createBlog);

//______________________________get api (blog document)______________________________________>>>
router.get("/blogs", auth.authentication,auth.authorization, blogController.getBlogs);

//______________________________update api ___________________________________________________>>>
router.put("/blogs/:blogId", auth.authentication,auth.authorization,blogController.updatedBlog);

//_______________________________delete api-1_________________________________________________>>>
router.delete("/blog", auth.authentication,auth.authorization,blogController.deletedBlog);

//_______________________________delete api-1_________________________________________________>>>
router.delete("/blogs/:blogId",auth.authentication,auth.authorization, blogController.deleteBlogs);

//===============================================================================================

module.exports = router;
