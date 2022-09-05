const express = require('express');
const router = express.Router();
const authorControllers = require('../controllers/authorController');
// const blogControllers = require('../controllers/blogController');


router.post('/author', authorControllers.author);


module.exports = router;