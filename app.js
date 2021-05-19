const express = require('express');
const http = require('http');
var path = require('path');
var userRouter = require('./routes/index')
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser')
const app = express();
const ejs = require("ejs");


//view engine setup

app.set('view engine', 'ejs');

//static folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
//routes
// app.use('/', userRouter);

//Session initialization
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

//passport-plugins
app.use(passport.initialize());
app.use(passport.session());

//mongoose connection
mongoose.connect("mongodb://localhost:27017/BookDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Register route
app.get("/register", function(req, res) {
  res.render("register");
})

app.post("/register", function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register")
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/about")
      })
    }
  })
});

//Sign in route
app.get("/signin", function(req, res) {
  res.render("signin");
})

app.post("/signin", function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/about");
      })
    }
});
});



app.get("/about", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("about")
  } else {
    res.redirect("/register")
  }
})

//listening port setup
var server = http.createServer(app);
server.listen(3000, (err) => {
  console.log("port successfully connected")
});
