const authorModel = require("../models/authorModels");

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
      return res
        .status(400)
        .send({ status: false, msg: "type error and empty field" });
    }
    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "type error and empty field" });
    }
    if (!isValid(email) && !/[a-z0-9]{2,30}+@[a-z]+\.[a-z]{2,3}/.test(email)) {
      return res.status(400).send({
        status: false,
        msg: "email is compulsory and it  should be in proper format",
      });
    }
    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, msg: "Password is mandatory" });
    }
    const result = await authorModel.create(data);
    res.status(201).send({ status: true, data: result });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

//===================================module expoting==========================================

module.exports.createAuthor = createAuthor;

module.exports.isValid = isValid;

//mongoose.isValidObjectId(id)
