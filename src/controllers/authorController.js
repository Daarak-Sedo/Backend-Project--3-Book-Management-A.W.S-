const authorModel = require("../models/authorModels");
const jwt = require("jsonwebtoken");

//=============================Validation================================================
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value != "string") return false;
  return true;
};
//===========================post Api for creating author================================
const createAuthor = async function (req, res) {
  try {
    const data = req.body;
    let { fname, lname, title, email, password } = data;
    if (!isValid(fname)) {
      return res
        .status(400)
        .send({ status: false, msg: "type error and empty field " });
    }
    if (!isValid(lname)) {
      return res.status(400).send({ status: false, msg: "type error and empty field" });
    }
    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "type error and empty field" });
    }
    if (!isValid(email) && !/[a-z0-9]{2,30}+@[a-z]+\.[a-z]{2,3}/.test(email)) {
      return res.status(400).send({
        status: false,
        msg: "email is compulsory and it  should be in proper format",
      });
    }
    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: "Password is mandatory" });
    }
    const result = await authorModel.create(data);
    res
      .status(201)
      .send({ status: true, msg: "new author is created", data: result });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};
//_______________________login author ___________________________________________

let loginAuthor = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!email)
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid email id" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid password" });

    let author = await author.findOne({ email: email, password: password });
    if (!author)
      return res.status(400).send({
        status: false,
        msg: "email or the password is not correct",
      });

    let token = jwt.sign(
      {
        authorId: author._id,
        project: 1,
        group: "group-2",
      },
      "functionUp-project1"
    );
    console.log(token);
    res.status(201).send({ status: true, data: { token } });
  } catch (err) {
    res.status(500).send({ msg: "Error", msg: err.message });
  }
};

//===================================module expoting==========================================

module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;

module.exports.isValid = isValid;

//mongoose.isValidObjectId(id)
