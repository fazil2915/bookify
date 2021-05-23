const express = require('express');
const http = require('http');
var path = require('path');
var Router = require('./routes/index')
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
// app.use(Router);

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
 mongoose.connect("mongodb+srv://book1234:book2021@cluster0.y2gry.mongodb.net/test",()=>
 console.log('db connected'),{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);


//Schema Define
const bookSchema = new mongoose.Schema({
  booktitle: String,
  bookauthor: String,
  bookContent: String,
  bookURL: String
})

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  book: [bookSchema]
});

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User", userSchema);
const Book = new mongoose.model("Book", bookSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
function isLoggedIn(req,res,next){
  if(req.isAuthenticated())return next();
  res.redirect('/signin')
}
function isLoggedOut(req,res,next){
  if(!req.isAuthenticated())return next();
  res.redirect('/')
}


app.get("/", function(req, res) {
  res.render("register");
})

//Register Route
app.post("/register", function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/")
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/home")
      })
    }
  })
});

//Sign in Route
app.get("/signin", function(req, res) {
  res.render("signin");
})

app.post("/signin", function(req, res) {
  //console.log(req.body.username);
  //console.log(req.body.password);
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);

    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/home");
      })
    }
});
 });
app.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
})

//home route
app.get("/home",isLoggedIn, function(req, res) {
  if (req.isAuthenticated()) {
    Book.find({}, function(err, foundList) {
      if(err) {
          res.send(err)
      }
      else {
        res.render("home", {newListItem: foundList})
      }

    })

  } else {
    res.redirect("/signin")
  }
})

//addbook route
app.get("/addbook", function(req, res) {
  if (req.isAuthenticated()) {
  console.log(req.user.id);
  console.log(req.user.email);
  res.render("addbook")
}
else {
  res.render("signin")
}
})


//addbook route
app.post("/addbook", function(req, res) {
  if (req.isAuthenticated()) {
    console.log(req.body.title);
    console.log(req.body.author);
    console.log(req.body.content);

    const title = req.body.title;
    const author = req.body.author;
    const content = req.body.content;
    const image = req.body.image;


      const book1 = new Book ({
        booktitle: title,
        bookauthor: author,
        bookContent: content,
        bookURL: image
      })
      book1.save();
      res.redirect("/home");
  }

   else {
    res.redirect("/signin")
  }

})

<!-- View Book Route -->

app.get("/home/:id", function(req, res) {
  if (req.isAuthenticated()) {
const name = req.params.id;
Book.findOne({booktitle: name}, function(err, found) {
   res.render("viewpage", {title: found.booktitle, author: found.bookauthor, content: found.bookContent, img: found.bookURL})
})
  }
  else {
    res.redirect("/signin")
  }
})

app.get("/mybook", function(req, res) {
  console.log(req.body.name);
})

//listening port setup
var server = http.createServer(app);
server.listen(3000, (err) => {
  console.log("port successfully connected")
});
