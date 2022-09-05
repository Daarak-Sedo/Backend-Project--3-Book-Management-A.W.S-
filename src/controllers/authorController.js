const authorModel = require("../models/authorModels");

//===========================================================================
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value != "string") return false;
  return true;
};

const createAuthor = async function (req, res) {
  try {
    const data = req.body;
    let { fname, lname, title, email, password } = data;
    if (!isValid(fname)) {
      return res.status(400).send({ status: false, msg: "fname must be present" });
    }
    if (!isValid(lname)) {
      return res.status(400).send({ status: false, msg: "lname must be present" });
    }
    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "title must include Mr, Mrs, Miss" });
    }
    if (!isValid(email)) {
      return res.status(400).send({ status: false, msg: "email is compulsory" });
    }
    if (!/[a-z0-9]{2,20}+@[a-z]+\.[a-z]{2,3}/.test(email)) {
      return res.status(400).send({ status: false, msg: "email should be in proper format" });
    }

    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: "Password is mandatory" });
    }
    const result = await authorModel.create(data);
    res.status(201).send({ status: true, data: result });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

//===========================================================================
module.exports.createAuthor = createAuthor;
module.exports.isValid= isValid;
