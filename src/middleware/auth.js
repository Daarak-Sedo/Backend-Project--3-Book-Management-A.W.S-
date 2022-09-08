let jwt = require("jsonwebtoken");

// Authoentication:->>>====================================================================>>>
const authentication = async function (req, res, next) {
  try {
    // check token :
    let token = req.headers["x-api-key"];
    if (!token) req.headers["x-api-key"];
    if (!token)
      return res.status(400).send({ status: false, msg: "Token Must be Filled" });
    console.log(token);

    // verify token :
    let decodedToken = jwt.verify(token, "project_1");
    if (!decodedToken)
      return res.status(400).send({status: false,msg: "Token Not Verified Please Enter Valid Token"});
    return res.status(200).send({ status: true, msg: "Author Authenticated Succesfully " });

    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// Authorization:->>>=======================================================================>>>
const authorization = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    // if (!token) token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ status: false, msg: "Token must be present" });
    }
    let decodedToken = jwt.verify(token, "project_1");
    if (!decodedToken) {
      return res.status(401).send({ status: false, msg: "Token is invalid" });
    }
    let authorToBeModified = req.params.authorId;
    let authorLoggedin = decodedToken.authorId;
    if (authorToBeModified != authorLoggedin) {
      return res.status(403).send({status: false,msg: "author loggedin not allowed to modify changes"});
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.messge });
  }
};
//============================================================================================

module.exports.authentication = authentication;
module.exports.authorization = authorization;
