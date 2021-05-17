const express=require('express');
const http=require('http');
var path = require('path');
var userRouter = require('./routes/index')
var expressLayouts = require('express-ejs-layouts');
var connectDb=require('./config/connection')
var bodyParser=require('body-parser')
const app=express();

connectDb();
//view engine setup

app.set('view engine', 'ejs');
app.use(expressLayouts);

//static folder
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: true}))
//routes
app.use('/',userRouter);

//listening port setup
var server = http.createServer(app);
server.listen(3000,(err)=>{
 console.log("port successfully connected")
});