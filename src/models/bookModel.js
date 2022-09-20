// const mongoose = require("mongoose");
// let ObjectId = mongoose.Schema.Types.ObjectId;

// const blogSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     body: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     authorId: {
//       type: ObjectId,
//       required: true,
//       ref: "author",
//     },
//     tags: {
//       type: [String],
//       trim: true,
//     },
//     category: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     subcategory: {
//       type: [String],
//       trim: true,
//     },
//     deletedAt: {
//       type: Date,
//       default: null,
//     },
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//     publishedAt: {
//       type: Date,
//       default: null,
//     },
//     isPublished: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("blog", blogSchema);

/*
{ 
  title: {string, mandatory, unique},
  excerpt: {string, mandatory}, 
  userId: {ObjectId, mandatory, refs to user model},
  ISBN: {string, mandatory, unique},
  category: {string, mandatory},
  subcategory: [string, mandatory],
  reviews: {number, default: 0, comment: Holds number of reviews of this book},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  releasedAt: {Date, mandatory, format("YYYY-MM-DD")},
  createdAt: {timestamp},
  updatedAt: {timestamp},
}
*/