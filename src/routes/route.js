const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");

//______________________________post api (user creation)__________________________________>>>
router.post("/register", userController.createUser);

//_______________________________post api for login user ________________________________>>>
router.post("/login", userController.loginUser);

// ------------------------------------post api for createBook------------------------------>>>
router.post("/books",auth.authentication,bookController.createBook)


//------------------------------------Get API for book details by Query--------------------->>>
router.get("/books",auth.authentication,bookController.getBooks)


//---------------------------------Get API for all book details by param------------------------->>>
router.get("/books/:userId",auth.authentication,bookController.bookDetails)




module.exports = router;





