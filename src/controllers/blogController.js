const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const validation = require("../validator/validation");
let {isEmpty,isValidName, isValidObjectId} = validation;

//___create blogs__________________________________________________________________________________

  const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let { title, body, authorId, category } = data;
    if(Object.keys(data).length == 0){
      return res.status(400).send({ status: false, msg: "Please provide key in request body" });    
    }
    if(!isEmpty(authorId)){
      return res.status(400).send({ status: false, msg: "Please provide author ID" });
    } 
    if (!isEmpty(title)) {
      return res.status(400).send({ status: false, msg: "Please provide title" });
    }
    if (!isEmpty(body)) {
      return res.status(400).send({ status: false, msg: "Please provide body of blog" });
    }
    if (!isEmpty(category)) {
      return res.status(400).send({ status: false, msg: "Please provide category" });
    }
    if(!isValidName(title)){
      return res.status(400).send({ status: false, msg: "title should be alphabets only" });
    }
    if(!isValidName(category)){
      return res.status(400).send({ status: false, msg: "category should be alphabets only" });
    }
    if(!isValidObjectId(authorId)){
      return res.status(400).send({ status: false, msg: "Provide a valid author id" });
    }
    let checkAuthorId = await authorModel.findById(data.authorId);
    if (!checkAuthorId) {
      return res.status(400).send({ status: false, msg: "please provide valid author id" });
    }
    let blogData = await blogModel.create(data);
    res.status(201).send({ status: true, msg: "Blog has been created",  data: blogData, });
  } catch (err) {
    return res.status(500).send({ Satus: false, msg: err.message });
  }
};

//_______get api________________________________________________________________________>>>

const getBlogs = async function (req, res) {
  try {
    const filterQuery = {isDeleted: false,deletedAt: null,isPublished: true};
    const queryParam = req.query;

    const { authorId, category, tags, subcategory } = queryParam;
    if (Object.keys(queryParam).length == 0) {
      return res.status(400).send({ status: false, msg: "InValid request" });
    }
    if (isEmpty(category)) {
      filterQuery["category"] = category;
    }
    if (isEmpty(tags)) {
      const tagsArray = tags.trim().split(",").map((tag) => tag.trim());
      filterQuery["tags"] = { $all: tagsArray };
    }
    if (isEmpty(subcategory)) {
      const subcatArray = subcategory.trim().split(",").map((subcat) => subcat.trim());
      filterQuery["subcategory"] = { $all: subcatArray };
    }
    if (isEmpty(authorId)) {
      filterQuery["authorId"] = authorId;
    }
    const blogs = await blogModel.find(filterQuery);
    if (Array.isArray(blogs) && blogs.length === 0) {
      res.status(404).send({ status: false, msg: "No matching blogs found" });
    }
    res.status(200).send({ status: true, msg: "Found Matching", data: blogs });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//_____update api_______________________________________________________________________>>>

const updatedBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    const blogData = req.body;

    let { title, body, tags, subcategory } = blogData;
    if (!isValidObjectId(blogId))
      return res.status(404).send({status: false,msg: "Blog Is Not Found , Please Enter Valid Blog Id"});

    if (Object.keys(blogData).length == 0){
      return res.status(400).send({ status: false, msg: "Body is required" });
    }

      if(title || title==""){
        if (!isEmpty(title)) {
          return res.status(400).send({ status: false, msg: "Please provide title" });
        }
        if(!isValidName(title)){
          return res.status(400).send({ status: false, msg: "title should be alphabets only" });
        }
      }
      if(body || body ==""){
        if (!isEmpty(body)) {
          return res.status(400).send({ status: false, msg: "Please provide body of blog" });
        }
      }
      if(tags || tags== ""){
        if (!isEmpty(category)) {
          return res.status(400).send({ status: false, msg: "Please provide category" });
        }
      }
      if(subcategory || subcategory== ""){
        if (!isEmpty(category)) {
          return res.status(400).send({ status: false, msg: "Please provide category" });
        }
      }

    let blog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false },{$set: {isPublished: true,body: body,title: title,publishedAt: new Date()},$push: { tags: tags, subcategory: subcategory }},{ new: true });
    return res.status(200).send({ status: true, msg: "Blog updated successfully",data: blog });
  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};
//_______delete blog api 1________________________________________________________>>>

const deletedBlog = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    let checkBlogId = await blogModel.findById(blogId);

    if(!checkBlogId || (checkBlogId.isDeleted == true)){
      return res.status(404).send({status : false,msg : "Blog has been deleted successfully"})         
  }
     let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId },{ $set: { isDeleted: true,deletedAt: Date.now()}},{ new: true });
    return res.status(200).send({status: true,msg: "Blog has been deleted successfully",data:deletedBlog});
  } catch (err) {return res.status(500).send({ status: false, msg: err.message })}
};

//______delete blogs api 2 by given fields _________________________________________>>>

const deleteByQueryParams = async function (req, res) {
  try {
    let data = req.query;
    if(!Object.keys(data).length==0){
      return res.status(400).send({status: false, message: 'keys must be present'});
    }
      const deleteByQuery = await blogModel.updateMany({ $and: [data ,{authorId : req.id}, { isDeleted: false }] },{ $set: { isDeleted: true ,deletedAt:new Date()} },{ new: true, upsert : true })
      let count = deleteByQuery.modifiedCount
      if (deleteByQuery.modifiedCount==0) {
      return res.status(404).send({ status: false, msg: "No Blog Found"})
  }
      res.status(200).send({status : true, msg : "No of blogs deleted:", count })
  }
  catch (err) {res.status(500).send({status:false,msg: err.message})}
};

//======================module exporting ==================================

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updatedBlog = updatedBlog;
module.exports.deletedBlog = deletedBlog;
module.exports.deleteByQueryParams = deleteByQueryParams;

