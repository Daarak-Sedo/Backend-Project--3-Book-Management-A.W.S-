const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

//=============================Validation================================================

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value != "string") return false;
  return true;
};
//__________post Api for creating author__________________________________________>>>

const createAuthor = async function (req, res) {
  try {
    const data = req.body;
   let { fname, lname, title, email, password } = data;
    if (!isValid(fname)) {
      return res.status(400).send({ status: false, msg: "type error and empty field " });
    }
    if (!isValid(lname)) {
      return res.status(400).send({ status: false, msg: "type error and empty field" });
    }
    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "type error and empty field" });
    }
    if (!isValid(email) && !/[a-z0-9]{2,30}+@[a-z]+\.[a-z]{2,3}/.test(email)) {
      return res.status(400).send({status: false, msg: "email is compulsory and it  should be in proper format"});
    }
    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: "Password is mandatory" });
    }
    const result = await authorModel.create(data);
    res.status(201).send({ status: true, msg: "new author is created", data: result });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};
//________login author _____________________________________________________________>>>

let loginAuthor = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;
    console.log(email, password)

    if (!isValid(email)){
      return res.status(400).send({ status: false, msg: "please provide valid email id" });
    }
    if (!isValid(password)){
      return res.status(400).send({ status: false, msg: "please provide valid password" });
    }
    let checkData = await authorModel.findOne({ email: email, password: password });
    if (!checkData){
      return res.status(400).send({status: false,msg: "email or the password is not correct"});
    }
    let token = jwt.sign(
      {
        authorId: checkData._id,
        project: 1,
        group: "group-4",
      },
      "project_1"
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


