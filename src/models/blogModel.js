const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: 'author',
    },
    tags: [String],
    category: {
        type: String,
        required: true,
    },
    subCategory : [String],
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }, 
    publishedAt: {
        type: Date,
    }, 
    isPublished: {
        type: Boolean,
        default: false
    },
}, { timestamps: true }); 

module.exports = mongoose.model("blog", blogSchema); 


// { title: {mandatory}, body: {mandatory}, authorId: {mandatory, refs to author model}, tags: {array of string}, category: {string, mandatory, examples: [technology, entertainment, life style, food, fashion]}, subcategory: {array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, createdAt, updatedAt, deletedAt: {when the document is deleted}, isDeleted: {boolean, default: false}, publishedAt: {when the blog is published}, isPublished: {boolean, default: false}}
