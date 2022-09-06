const { default: mongoose } = require("mongoose");
const authorModel = require("../models/authorModels");
const blogModel = require("../models/blogModel");

//=============================Validation==========================================
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value != "string") return false;
  return true;
};

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
//===============================================================
// const getBlogs = async ()=>{
//   try{
//   let data = req.query;
//   let getBlogs = await blog.find({
//     $and: [
//       { $and: [{ isDeleted: false }, { isPublished: true }] },
//       {
//         $or: [
//           { authorId: { $in: data.authorId } },
//           { category: { $in: [data.category] } },
//           { tags: { $in: [data.tags] } },
//           { subCategory: { $in: [data.subCategory] } },
//         ],
//       },
//     ],
//   });

// }catch(err){
//   return res.status(500).send({status:true, msg:err.message});
// }
// }

//===========================================================================
module.exports.createAuthor = createAuthor;
module.exports.isValid= isValid;
