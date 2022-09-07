const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModels");
const { isValid } = require("../controllers/authorController");

//___create blogs__________________________________________________________________________________

const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let { title, body, authorId, category } = data;
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
    if (!category) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide category" });
    }
    let checkAuthorId = await authorModel.findById(data.authorId);
    if (!checkAuthorId) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid author id" });
    }
    let blogData = await blogModel.create(data);
    res
      .status(201)
      .send({ status: true, data: blogData, msg: "Blog has been created" });
  } catch (err) {
    return res.status(500).send({ Satus: false, msg: err.message });
  }
};
//===================================get api===============================================

const getBlogs = async (req, res) => {
  try {
    let data = req.query;

    let getBlogs = await blog.find({
      $and: [
        { $and: [{ isDeleted: false }, { isPublished: true }] },
        {
          $or: [
            { authorId: { $in: data.authorId } },
            { category: { $in: [data.category] } },
            { tags: { $in: [data.tags] } },
            { subCategory: { $in: [data.subCategory] } },
          ],
        },
      ],
    });

    if (getBlogs.length == 0)
      return res.status(200).send({ status: true, msg: "No such blog exist" });
    res.status(200).send({
      status: true,
      data: getBlogs,
      msg: "Blogs data are re filtered successfully",
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//===================================update api====================================================
const updatedBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    const blogData = req.body;

    let { title, body, tags, subcategory } = blogData;
    if (!blogId)
      return res.status(404).send({
        status: false,
        msg: "Blog Is Not Found , Please Enter Valid Blog Id",
      });

    if (Object.keys(blogData).length == 0)
      return res.status(400).send({ status: false, msg: "Body is required" });

    let blog = await blogModel.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      {
        $set: {
          isPublished: true,
          body: body,
          title: title,
          publishedAt: new Date(),
        },
        $push: { tags: tags, subcategory: subcategory },
      },
      { new: true }
    );

    return res.status(200).send({ status: true, data: blog });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, Error: error.message });
  }
};
//==================================delete====================================================

const deletedBlog = async (req, res) => {
  try {
    let blogId = req.query.blogId;
    let checkBlogId = await blogModel.findById(blogId);
    // if(!checkBlogId){
    //    res.status(404).send({status:false, msg:"no such blog is exist"});
    // }
    if(checkBlogId.isDeleted){
      return res.status(404).send({status:false, msg:"blog is already deleted"})
    }
    let deletedBlog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        msg: "Blog has been deleted successfully",
        data: deletedBlog,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
//___________________________________________________________________________________________
//category, authorid, tag name, subcategory name, unpublished
// const deleteMany = async (req,res)=>{
//   try{
//     let data = req.param.isPublished;
//     console.log(data);
//     if(data.ispublished==false){
//       res.status(200).send({msg:"blog is successfully deleted"})
    
//     }
//     //let result = await blogModel.updateMany()

//   }catch(err){
//   return res.status(500).send({status:false, msg: err.message});

//   }
// }
//---------------------------------------------------
// const deleteBlog = async function (req, res) {
    
//   let blogId = req.params.blogId
  
//   let blog = await blogmodel.findById(blogId)
//   if (blog.isDeleted === true) {
//       return res.status(404).send({ status: false, message: "No such blogId exists" })
//   }
//   //.send({status: true, msg: deletedBlog})
//   let deletedBlog = await blogmodel.findOneAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: new Date() })
//   res.status(200).send({ status: true, msg: "Data is successfully deleted" })
// }

//===============================================================// correct
const deleteBlogs = async (req,res) =>{
  let qCategory = req.query.category;
  let qAuthorid = req.query.authorid;
  let qTag = req.query.tag;
  let qName = req.query.name;
  let qSubcategory = req.query.subcategory;
  let qUnpublished = req.query.unpublished;
  let data = req.query;

  if(Object.keys(data) == 0)
  {
      return res.send({msg : "please provide somefillters"});
  }
  else{
     let deletedata  = await blogmodel.findOneAndDelete(qAuthorid)
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++

// const deleteBlogsByQueryParam = async ()=>{
//   try{
//     let getData = req.query;
//     let blogId = req.query.blogId;
//     let deleteData = await blogModel.updateMany({isDeleted:false, getData, blogId}, {$set:{isDeleted:true, deletedAt:Date.now()}}, {new:true});
//     res.status(200).send({status:true, msg:"Blog has been deleted"});

//   }catch(err){
//   return res.status(500).send({status:false, msg: err.message});

//   }
// }

//===========================================================================================

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updatedBlog = updatedBlog;
module.exports.deletedBlog = deletedBlog;
module.exports.deleteMany = deleteMany;
module.exports.deleteBlogsByQueryParam = deleteBlogsByQueryParam;
