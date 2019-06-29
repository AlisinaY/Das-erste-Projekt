const express = require("express");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const Article = require("./models/article.js");
const config = require("./config/database.js");


// Init App
const app = express();

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(config.database,{useNewUrlParser: true});

//Express-Session Middleware 
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// Express-Validator Middleware 
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Express-Messages Middleware 
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport config 
require("./config/passport")(passport);
// Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());

//
app.get("*", function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


// Home Route
app.get("/", function(req, res){

  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render("index",{
        title: "Articles",
        articles: articles,
      });
    }
  });
});

// Rputes Files
const articles = require("./routes/articles");
const users = require("./routes/users");
app.use("/articles", articles);
app.use("/users", users);


// Server
app.listen(3000, function(){
  console.log("Server started on port 3000");
});
