const blogModel = require('../models/blogModel');
const authorModel = require('../models/authorModels');
const {isValid} = require('../controllers/authorController') ; 

const createBlog = async function(req,res){
    try{
    let data = req.body;
    let {title, body, authorId, tags} = data;
    if(!isValid(title)){
        return res.status(400).send({status:false, msg:"Please provide title"})
    }
    if(!isValid(body)){
        return res.status(400).send({status:false, msg:"Please provide body"})
    }
    if(!isValid(tags)){
        return res.status(400).send({status:false, msg:"Please provide tags"})
    }
    let checkAuthorId = await authorModel.findById(authorId);
    if(!checkAuthorId){
        return res.status(400).send({status:false, msg:"please provide valid author id"})
    }
    let blogData = await blogModel.create(data);
    res.status(201).send({status:true, data:blogData});
    }catch(err){
        return res.status(500).send({Satus:false, msg:err.message});
    }
}

module.exports.createBlog = createBlog;

