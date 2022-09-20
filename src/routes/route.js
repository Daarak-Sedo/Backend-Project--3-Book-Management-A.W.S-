const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
//const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");

//______________________________post api (author creation)__________________________________>>>
router.post("/register", userController.createUser);

//_______________________________post api for login aouthor ________________________________>>>
router.post("/login", userController.loginUser);


//===============================================================================================

module.exports = router;





