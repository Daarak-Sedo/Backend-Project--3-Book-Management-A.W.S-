const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validation");
const reviewModel = require("../models/reviewModel");
let { isEmpty,  isValidObjectId, isValidRating } = validation;


const bookReview = async function (req, res) {
    try {
        let requestBody = req.body
        let bookId = req.params.bookId

        let { reviewedBy, rating, review } = requestBody
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is in wrong format" })
        };

        let book = await bookModel.findById(bookId)
        if (!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "No book found" })
        }
        if (!isEmpty(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details' })
        }

        if (!isEmpty(reviewedBy) && !isValidName(reviewedBy)) {
            return res.status(400).send({ status: false, message: "please provide valid reviews" })
        };
        if (review && !isEmpty(review)) {
            return res.status(400).send({ status: false, message: "review is in wrong format" })
        };
        if (!rating) {
            return res.status(400).send({ status: false, message: "please provide rating " })
        };
        if (!isValidRating(rating)) {
            return res.status(400).send({ status: false, message: "please provide valid rating " })
        };
       
       
        // if (isDeleted && typeof isDeleted != Boolean ) {
        //     return res.status(400).send({ status: false, message: "isDeleted is in wrong format" })
        // };

        requestBody.reviewedAt = new Date()
        requestBody.bookId = bookId

        const reviewDoc = await reviewModel.create(requestBody)
        let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new : true })

        //updatedBook = updatedBook.toObject();
        updatedBook['reviewsData'] = [reviewDoc];

        return res.status(201).send({ status: true, message: "Review created successfully", data: updatedBook })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports.bookReview=bookReview