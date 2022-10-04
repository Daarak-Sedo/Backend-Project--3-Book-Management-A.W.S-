const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validation");
const moment = require("moment");
const multer = require('multer');
const aws = require('aws-sdk');

let { isEmpty, isValidName, isValidObjectId, isValidISBN } = validation;  //importing Function

  // Using A.W.S S3 - for Media storage

aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKey: "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",
        region: "ap-south-1"
    }
)

let uploadFile = async (file) => {
    return new Promise( function(resolve, reject) {
        //this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" }) //we will be using s3 service of aws
        //  await uploadFile(files[0])
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", // HERE
            Key: "abhishek/" + file.originalname, // HERE 
            Body: file.buffer
        }

      s3.upload(uploadParams, function (err, data) {
            if (err) { 
                return reject({ "error": err }) 
            }

            console.log(data)
            console.log(" file uploaded succesfully ")
            return resolve(data.Location) // HERE
          }
        )
    }
    )
}
//------------------_create blogs---------------------------------------->>>

const createBook = async function (req, res) {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide key in request body" });
        }

        if (!isEmpty(userId)) {
            return res.status(400).send({ status: false, msg: "Please provide user ID" });
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Provide a valid user id" });
        }

        let checkUser = await userModel.findById(userId)
        if (!checkUser)
            return res.status(404).send({ status: false, message: "User not found" });

        if (!isEmpty(title)) {
            return res.status(400).send({ status: false, msg: "Please provide title" });
        }

        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle)
            return res.status(400).send({ status: false, message: "Title  must be unique" });


        if (!isEmpty(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please provide excerpt of blog" });
        }
        if (!isEmpty(category)) {
            return res.status(400).send({ status: false, msg: "Please provide category" });
        }

        if (!isEmpty(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please provide subcategory" });
        }


        if (!isValidName(category)) {
            return res.status(400).send({ status: false, msg: "category should be alphabets only" });
        }

        if (!isEmpty(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please provide ISBN" });
        }

        if (!isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid 13 Digit  ISBN" });
        }
        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN)
            return res.status(404).send({ status: false, message: " ISBN must be unique " });

        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "Must present releseAt" })
        }
        if (!moment.utc(releasedAt, "YYYY-MM-DD", true).isValid())
            return res.status(400).send({ status: false, message: "enter date in valid format eg. (YYYY-MM-DD)...!" })


        let bookData = await bookModel.create(data)
        res.status(201).send({ status: true, msg: "Blog has been created", data: bookData });

    } catch (err) {
        return res.status(500).send({ Satus: false, msg: err.message });
    }
};

//---------------------------get api--------------------------------------->>>
const getBooks = async (req, res) => {
    try {
        let data = req.query;
        if (!data)
            return res.status(404).send({ status: false, msg: "No data found in query" })

        if (data.userId) {
            if (!isValidObjectId(data.userId))
                return res.status(400).send({ status: false, msg: "please enter a valid userId" })
        }

        let getBook = await bookModel.find({ isDeleted: false, ...data }).select({ title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
        if (getBook.length == 0)
            return res.status(404).send({ status: false, message: "no documents found with this query" })

        return res.status(200).send({ status: true, message: 'Books list', data: getBook })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.massage })
    }
}
//--------------------------get book details by params------------------->>

const bookDetails = async function (req, res) {
    try {
        let userId = req.params.userId;
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "user id is not valid" })

        let getBook = await bookModel.find({ isDeleted: false, userId: userId })
        if (getBook.length == 0)
            return res.status(404).send({ status: false, msg: "no documents found " })

        return res.status(200).send({ status: true, message: 'Books list', data: getBook })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.massage })
    }
}

//----------------------update book details ------------------------------->>

const updateBook = async function (req, res) {

    try {

        let data = req.body
        let { title, excerpt, ISBN } = data
        let bookId = req.params.bookId
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter book details for updating" })
        }
        if (excerpt) {
            if (!isEmpty(excerpt))
                return res.status(400).send({ status: false, msg: "Please provide excerpt of blog" });
        }

        if (title) {
            if (!isEmpty(title))
                return res.status(400).send({ status: false, msg: "Please provide title" });
        }
        if (ISBN) {
            if (!isValidISBN(ISBN))
                return res.status(400).send({ status: false, msg: "Please provide a valid ISBN" });
        }
        let findBook = await bookModel.findById(bookId)
        if (findBook.isDeleted == true)
            return res.status(404).send({ status: false, message: "Book is already deleted" })

        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({ status: false, message: "Book already exist with this title" })
        }

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) {
            return res.status(400).send({ status: false, message: "Book already exist with this ISBN" })
        }

        let updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { title: title, excerpt: excerpt, ISBN } }, { new: true })
        return res.status(200).send({ status: true, message: "Update successful", data: updatedBooks })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

//-------------------------------delete books----------------------------------->>
const deleteBook = async function (req, res) {

    try {

        let bookId = req.params.bookId

        let checkBook = await bookModel.findById(bookId)

        if (!checkBook.isDeleted == false)
            return res.status(400).send({ status: false, message: "Book is already deleted" })

        if (checkBook.isDeleted == false) {   //condition wants to excecute

            let deletedDoc = await bookModel.findOneAndUpdate(
                { _id: bookId },
                { $set: { isDeleted: true, deletedAt: new Date() } },{new:true})
                return res.status(200).send({status:true,message:"book is deleted sussesfully",data:deletedDoc})
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.massage })
    }

}

    //======================module exporting ==================================

    module.exports.createBook = createBook;
    module.exports.getBooks = getBooks;
    module.exports.bookDetails = bookDetails
    module.exports.updateBook = updateBook;
    module.exports.deleteBook = deleteBook;








