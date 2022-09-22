let jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const validation = require("../validator/validation");
// Authentication:->>>====================================================================>>>

const authentication = async function (req, res, next) {
  try {
    // check token :
    let token = req.headers["x-api-key"];
    if (!token)
      return res.status(401).send({ status: false, msg: "Token Must be Filled" });
    
    // verify token :
    let decodedToken = jwt.verify(token, "project3");
    if (!decodedToken)
      return res.status(400).send({status: false,msg: "Token Not Verified Please Enter Valid Token"});

    req.decodedToken = decodedToken;

    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// --------------------------------Authorization:-------------------------------------------->>>>

 const authorization = async function (req, res, next) {
  try {
    let userLoggedIn = req.decodedToken.userId;
    let bookId = req.params.bookId;
    if( !validation.isValidObjectId(bookId)){
      return res.status(400).send({ status: false, msg: "Please enter valid Book Id"})
  
  }
    let checkBookId = await bookModel.findById(bookId)
    if (!checkBookId) {
      return res.status(404).send({status: false, message: "Book not Found"})
  }
    if (checkBookId.userId != userLoggedIn) {
      return res.status(403).send({status: false,msg: "loggedin user not allowed to modify changes"});
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.messge });
  }
};


//============================================================================================

module.exports.authentication = authentication;
 module.exports.authorization = authorization;




