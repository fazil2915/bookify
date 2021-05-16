const express=require('express');
const http=require('http');
var path = require('path');
var userRouter = require('./routes/index')
var expressLayouts = require('express-ejs-layouts');
const app=express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

//static folder
app.use(express.static(path.join(__dirname,'public')));

//routes
app.use('/',userRouter);

//listening port setup
var server = http.createServer(app);
server.listen(3000,(err)=>{
 console.log("port successfully connected")
});