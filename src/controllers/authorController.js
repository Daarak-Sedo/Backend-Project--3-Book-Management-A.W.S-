const { default: mongoose } = require("mongoose");
const authorModel = require("../models/authorModels");
const blogModel = require("../models/blogModel");

//=============================Validation================================================
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value != "string") return false;
  return true;
};
//===========================post Api for creating author================================
const createAuthor = async function (req, res) {
  try {
    const data = req.body;
    let { fname, lname, title, email, password } = data;
    if (!isValid(fname)) {
      return res.status(400).send({ status: false, msg: "type error and empty field " });
    }
    if (!isValid(lname)) {
      return res.status(400).send({ status: false, msg: "type error and empty field" });
    }
    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "type error and empty field" });
    }
    if (!isValid(email) && (!/[a-z0-9]{2,30}+@[a-z]+\.[a-z]{2,3}/.test(email)) ) {
      return res.status(400).send({ status: false, msg: "email is compulsory and it  should be in proper format" });
    }
    //rajputmeenakshi982@gmail.com
    
    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: "Password is mandatory" });
    }
    const result = await authorModel.create(data);
    res.status(201).send({ status: true, data: result });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};
//=================================get api===============================================

 const getBlogs = async function (req, res) {
  try {
     const queries = req.query // it gives an object
    
      if (Object.keys(queries) == 0) {
          const result1 = await blogModel.find({ isDeleted: false, isPublished: true })//.count()
          if (result1.length == 0) return res.status(404).send({ status: false, msg: "no data found" })
          return res.status(200).send({ status: true, data: result1 })
      }

      //--------------------------------- this is for query param ---------------------------
      else {
          const result2 = await blogModel.find(queries).find({ isDeleted: false, isPublished: false })//.count()
          if (result2.length == 0) return res.status(404).send({ status: false, msg: "no data found" })
          return res.status(200).send({ status: true, data: result2 })
      }
  }
  catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
  }
}

//===================================module expoting==========================================
   
module.exports.createAuthor = createAuthor;

module.exports.isValid= isValid;
module.exports.getBlogs= getBlogs;


//mongoose.isValidObjectId(id)

