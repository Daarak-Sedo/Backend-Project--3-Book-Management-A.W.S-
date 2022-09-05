const express = require('express');
const routes = express.Router();
const bodyParser = require('body-parser');
const {default:mongoose} = require('mongoose');
const app = express();

app.use(bodyParser.json());

let url = "mongodb+srv://projectBlogGroup4:vtbjJPPyqvrHsBXQ@cluster0.rrdjyhd.mongodb.net/project-1";
let port = process.env.PORT||3000;

mongoose.connect(url, {useNewUrlParser:true}).then(()=>{
    console.log("MongoDb is connect")
}).catch(err=>{
    console.log(err);
})

app.use('/', routes);

app.listen(port, ()=>{
    console.log("Express is running on port "+ port)
});


