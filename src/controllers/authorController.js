const authorModel = require('../models/authorModels');

const author = async function(req,res){
    try{
        let data = req.body;
        let savedData = await authorModel.create(data);
        res.status(201).send({status:true, msg: savedData});
    }catch(err){
        console.log(err);
    }
}

module.exports.author = author;