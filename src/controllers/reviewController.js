const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validation");
const reviewModel = require("../models/reviewModel");
let { isEmpty,  isValidObjectId, isValidRating,isValidName } = validation;


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

const updateReview = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewID = req.params.reviewId
        const updateBody = req.body
        const { review, rating, reviewedBy } = updateBody;

        //validation 
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Incorrect bookId format" })
        }
        if (!isValidObjectId(reviewID)) {
            return res.status(400).send({ status: false, msg: "Incorrect reviewId format" })
        }
        if (!isEmpty(updateBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide review details to update.' })
        }

        // ---------------------------- checking review validation.
        if (review) {
            if (!isEmpty(review)) {
                return res.status(400).send({ status: false, message: "Review is missing ! Please provide the review details to update." })
            }

        }
        // ---------------------------- checking reviewedBy validation.
        if (reviewedBy) {

            if (!isEmpty(reviewedBy)) {
                return res.status(400).send({ status: false, message: "Reviewer's name is missing ! Please provide the name to update." })
            };
            if (!isValidName(reviewedBy)) {
                return res.status(400).send({ status: false, message: "reviewedBy is in wrong format" })
            };
        };

        // --------------------------- checking whether the rating is number or character.
        if (rating) {

            if (typeof rating != "number") {
                return res.status(400).send({ status: false, message: "rating is in wrong format" })
            };
            if (!isValidRating(rating)) {
                return res.status(400).send({ status: false, message: "rating must be between 1 and 5" })
            };
        };
        const searchBook = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ createdAt: 0, updatedAt: 0, __v: 0 })
        if (!searchBook) {
            return res.status(404).send({ status: false, message: `Book does not exist by this ${bookId}. ` })
        }
        const searchReview = await reviewModel.findOne({ _id: reviewID, isDeleted: false })
        if (!searchReview) {
            return res.status(404).send({ 
                status: false,
                message: `Review does not exist by this ${reviewID}.`
            })
        }
        if (searchReview.bookId != bookId) {
            return res.status(404).send({ status: false, message: "Review not found for this book" })
        }

        const updateReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewID }, { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true })//.select({review:1,rating:1,reviewedBy:1})

         let destructureForResponse = searchBook.toObject();
         destructureForResponse['reviewsData'] = [updateReviewDetails];
        
        
        return res.status(200).send({ status: true, message: "Successfully updated the review of the book.", data: destructureForResponse })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//---------------------------------delete  book review by query param------------------------------------ 

const deleteBookReview = async function (req, res) {
    try {
        //bookId from Params
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!isValidObjectId(bookId)) 
        return res.status(400).send({ status: false, message: "Please enter valid bookId...!" })

        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ deletedAt: 0 })
        if (!bookExist) return res.status(404).send({ status: false, message: "book not found" });

        //reviewId from params

        
        if (!isValidObjectId(reviewId))
         return res.status(400).send({ status: false, message: "enter valid reviewId...!" })

        //DB call
        const reviewExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId })
        if (!reviewExist) return res.status(404).send({ status: false, message: "review not found...!" })

        if (reviewExist.isDeleted == true) 
        return res.status(400).send({ status: false, data: "review is already deleted...!" })
        

            await reviewModel.findOneAndUpdate(
                { _id: reviewId, bookId: bookId, isDeleted: false },
                { $set: { isDeleted: true } },
                { new: true }
            );
            await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } })
            return res.status(200).send({ status: true, message: "deleted succesfully...!" })

        

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }

}


module.exports={bookReview,updateReview,deleteBookReview}
