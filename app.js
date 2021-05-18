const express=require('express');
const http=require('http');
var path = require('path');
var userRouter = require('./routes/index')
const mongoose = require("mongoose");
var expressLayouts = require('express-ejs-layouts');
var bodyParser=require('body-parser')
const app=express();
const ejs = require("ejs");

//mongoose connection
mongoose.connect("mongodb://localhost:27017/BookDB", {useNewUrlParser: true});


//view engine setup

app.set('view engine', 'ejs');

//static folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//routes
app.use('/', userRouter);

//listening port setup
var server = http.createServer(app);
server.listen(3000,(err)=>{
 console.log("port successfully connected")
});
