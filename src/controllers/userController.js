const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validation = require("../validator/validation");

let {isEmpty,isValidEmail,isValidPhone, isValidPassword,pincode,street,city} = validation;

//__________post Api for creating author______________________>>>

const createUser = async function (req, res) {
  try {
    const data = req.body;
    
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: "false", message: "All fields are mandatory" });
      }
   
    let { title, name, phone, email, password,address} = data;
    if (!isEmpty(name)) {
      return res.status(400).send({ status: false, msg: "Name must be present " });
    }
   //Validation for title
   if (!isEmpty(title)) {
    return res.status(400).send({status: false,msg: "Title is Missing or does not have a valid input"})}
   else {
    if (title != "Mr" && title != "Mrs" && title != "Miss") {
        return res.status(400).send({status: false,msg: "Title can only be Mr, Mrs or Miss"}) }}

    if (!phone)
    return res.status(400).send({ status: false, message: "Please Enter Your phone Number" });
  // if (!isValidPhone(phone.trim()))
  //   return res.status(400).send({status: false,message: "Phone no. should contain only 10 digits"});

  let existedphone = await userModel.findOne({ phone });
  if (existedphone)
    return res.status(400).send({status: false,message: "This Mobile No. is already registered"});

    
    if (!isEmpty(email)) {
      return res.status(400).send({status: false, msg: "email is compulsory"});
    }
    if (!isValidEmail(email)) {
      return res.status(400).send({status: "false",message: "provide a valid emailId"});
    }
    let checkEmail = await userModel.findOne({email: email});
    if(checkEmail){
      return res.status(400).send({status:false, msg: "email is already registered "});
    }

    if (!isEmpty(password)) {
      return res.status(400).send({ status: false, msg: "Password is mandatory" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({status: "false",message:"Password must contain atleast 8 characters including one upperCase, lowerCase, special characters and Numbers"});
    }

    if(!street(address.street)){
      return res.status(400).send({ status: false, msg: "Enter valid Street Name" })
    }

    if(!city(address.city)){
      return res.status(400).send({ status: false, msg: "Enter valid City Name" })
    }


    if(!pincode(address.pincode)){
      return res.status(400).send({ status: false, msg: "Enter valid Pin code" })
    }
    
    const result = await userModel.create(data);
    res.status(201).send({ status: true, msg: "new user is created", data: result });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

//________post api : login author _______________________________>>>

let loginUser = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (Object.keys(req.body).length == 0) {   // Object.keys() array of keys will return
      return res.status(400).send({status: false, message: "Please provide email and password"});
    }
    if (!email)
      return res.status(400).send({ status: false, msg: "Please Enter your Email Id" });
    if (!isValidEmail(email))
      return res.status(400).send({ status: false, msg: "Please Enter a valid Email Id." });

    
    if (!isEmpty(password)){
      return res.status(400).send({ status: false, msg: "please provide valid password" });
    }
    let checkData = await userModel.findOne({ email: email, password: password });
    if (!checkData){
      return res.status(400).send({status: false,msg: "email or the password is not correct"});
    }
    let token = jwt.sign({
        authorId: checkData._id.toString(),
        group: "group-67",
        iat:Math.floor(Date.now()/1000),
        exp:Math.floor(Date.now()/1000)+10*60*60,
      },"project3");
    
    res.status(200).send({ status: true,message: "Success",data: { token } });
  } catch (err) {
    res.status(500).send({ msg: "Error", msg: err.message });
  }
};

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;













