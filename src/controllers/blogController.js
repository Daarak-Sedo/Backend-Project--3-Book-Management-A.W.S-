const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModels");
const { isValid } = require("../controllers/authorController");

//___create blog__________________________________________________________________________________

const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let { title, body, authorId } = data;
    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide title" });
    }
    if (!isValid(body)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide body of blog" });
    }
    if (!tags) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide tags" });
    }
    let checkAuthorId = await authorModel.findById(authorId);
    if (!checkAuthorId) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid author id" });
    }
    let blogData = await blogModel.create(data);
    res.status(201).send({ status: true, data: blogData });
  } catch (err) {
    return res.status(500).send({ Satus: false, msg: err.message });
  }
};
//===================================get api===============================================

const getBlogs = async function (req, res) {
    try {
        const queries = req.query // it gives an object

        if (Object.keys(queries) == 0) {
            const result1 = await blogModel.find({ isDeleted: false, isPublished: true }).count()
            if (result1.length == 0) return res.status(404).send({ status: false, msg: "no Data found" })
            return res.status(200).send({ status: true, data: result1 })
        }
        // -------------------------------- this is for query param --------------------------------
        else {
            const result2 = await blogModel.find(queries).find({ isDeleted: false, isPublished: true }).count()
            if (result2.length == 0) return res.status(404).send({ status: false, msg: "no data " })
            return res.status(200).send({ status: true, data: result2 })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//===========================================================================================

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
