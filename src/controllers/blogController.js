const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const { isValid } = require("../controllers/authorController");

//___create blogs__________________________________________________________________________________

const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let { title, body, authorId, category } = data;
    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "Please provide title" });
    }
    if (!isValid(body)) {
      return res.status(400).send({ status: false, msg: "Please provide body of blog" });
    }
    if (!isValid(category)) {
      return res.status(400).send({ status: false, msg: "Please provide category" });
    }
    let checkAuthorId = await authorModel.findById(data.authorId);
    if (!checkAuthorId) {
      return res.status(400).send({ status: false, msg: "please provide valid author id" });
    }
    let blogData = await blogModel.create(data);
    res.status(201).send({ status: true, data: blogData, msg: "Blog has been created" });
  } catch (err) {
    return res.status(500).send({ Satus: false, msg: err.message });
  }
};
//_______get api________________________________________________________________________>>>

const getBlogs = async function (req, res) {
  try {
    let data = req.query;
    let { authorId, category, tags, subcategory } = data;
    let len = Object.keys(data).length;
    if (authorId) {
      console.log(`this is author ${authorId}`);
      let getDataByAuthorId = await blogModel.find({
        $and: [{ isDeleted: false, isPublished: true }, { authorId }],
      });
      return res.status(200).send({ status: true, data: getDataByAuthorId });
    } else if (category) {
      console.log(`this is the category  ${category}`);
      let getDataByCategory = await blogModel.find({
        $and: [{ isDeleted: false, isPublished: true }, { category }],
      });
      return res.status(200).send({ status: true, data: getDataByCategory });
    } else if (tags) {
      console.log(`this is the tags  ${tags}`);
      let getDataByTag = await blogModel.find({
        $and: [{ isDeleted: false, isPublished: true }, { tags }],
      });
      return res.status(200).send({ status: true, data: getDataByTag });
    } else if (subcategory) {
      console.log(`this is the subcategory  ${subcategory}`);
      let getDataBySubcategory = await blogModel.find({
        $and: [{ isDeleted: false, isPublished: true }, { subcategory }],
      });
      return res.status(200).send({ status: true, data: getDataBySubcategory });
    }
  } catch (err) {
    return res.status(500).send({ Satus: false, msg: err.message });
  }
};

//_____update api_______________________________________________________________________>>>

const updatedBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    const authorIdFromToken = req.authorId;
    const blogData = req.body;

    let { title, body, tags, subcategory } = blogData;
    if (!blogId)
      return res.status(404).send({status: false,msg: "Blog Is Not Found , Please Enter Valid Blog Id"});

    if (Object.keys(blogData).length == 0)
      return res.status(400).send({ status: false, msg: "Body is required" });

      const checkBlog = await blogModel.findOne({_id:blogId})
      if(checkBlog.authorId.toString()!==authorIdFromToken){
        res.status(401).send({status:false,msg:"unauthorized access"})
      }

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
//_______delete blog api 1________________________________________________________>>>

const deletedBlog = async (req, res) => {
  try {
    let blogId = req.query.blogId;
    const authorIdFromToken = req.authorId;
    let checkBlogId = await blogModel.findById(blogId);
    // if(!checkBlogId){
    //    res.status(404).send({status:false, msg:"no such blog is exist"});
    // }
    if (checkBlogId.isDeleted) {
      return res.status(404).send({ status: false, msg: "blog is already deleted" });
    }
    const checkBlog = await blogModel.findOne({_id:blogId})
      if(checkBlog.authorId.toString()!==authorIdFromToken){
        res.status(401).send({status:false,msg:"unauthorized access"})
      }
    let deletedBlog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    return res.status(200).send({
      status: true,
      msg: "Blog has been deleted successfully",
      data: deletedBlog,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
//______delete blogs api 2 by given fields _________________________________________>>>

const deleteByQueryParams = async (req, res) => {
  try{
  let data = req.query;
  let filterQuery = {isDeleted:false,deletedAt:null}
  const authorIdFromToken = req.authorId;
  let { category, authorId, tags, subcategory, isPublished } = data;
  
  if (Object.keys(data) == 0){
    return res.status(400).send({ msg: "InValid request" });
  }
  if(isValid(category)){
    filterQuery['category'] = category;
  }
  if(isValid(tags)){
    const tagsArray = tags.trim().split(',').map(tag=>tag.trim())
    filterQuery['tags'] = {$all: tagsArray};
  }
  if(isValid(subcategory)){
    const subcatArray = subcategory.trim().split(',').map(subcat=>subcat.trim())
    filterQuery['subcateg'] = {$all: subcatArray};
  }
  if(isValid(isPublished)){
    filterQuery['isPublished'] = isPublished;
  }
  if(isValid(authorId)){
    filterQuery['authorId'] = authorId;
  }
  let blog = await blogModel.find(filterQuery)
  if(Array.isArray(blog) && blog.length===0){
    res.status(404).send({status:false, msg:"No matching blogs found"});
  }
  const blogsToDelete = blog.map(blog=>{
    if(blog.authorId.toString()===authorIdFromToken) return blog._id
  })
  if(blogsToDelete.length===0){
    res.status(404).send({status:false, msg:"no matching blogs found"})
  }
  await blogModel.updateMany({_id: {$in: blogsToDelete }},{$set:{isDeleted:true, deletedAt:Date.now()}})
  res.status(200).send({status:true, msg:"blog deleted successfully"})

}catch(err){
  return res.status(500).send({status:false, msg: err.message});
}
}

//==================================module exporting =========================================================

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updatedBlog = updatedBlog;
module.exports.deletedBlog = deletedBlog;
module.exports.deleteByQueryParams = deleteByQueryParams;
