const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");

//==============================>>>Phase-1<<<==================================================

//______________________________post api (author)___________________________________________>>>

router.post("/author", authorController.createAuthor);

//______________________________post api (blog)_____________________________________________>>>

router.post("/blog", blogController.createBlog);

//______________________________get api (blog document)______________________________________>>>


router.get('/blogs', blogController.getBlogs);

//______________________________update api __________________________________________________>>>

router.put('/blogs/:blogId', blogController.updatedBlog);

//_______________________________delete api__________________________________________________>>>

 router.delete('/blogs/:blogId', blogController.deletedBlog);
 router.delete('/blogs/queryParams', blogController.deleteBlogsByQueryParam);

//=============================================================================================


module.exports = router;
