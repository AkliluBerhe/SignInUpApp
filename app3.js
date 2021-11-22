/* //jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongose = require("mongoose");
const encrypt = require("mongoose-encryption");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { Passport } = require("passport");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

//level-3 cookies
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));
//level-3
app.use(passport.initialize());
//level-3
app.use(passport.session());


//connect to mongoDB
mongose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
mongose.set("useCreateIndex", true);
//create schema
const userSchema = new mongose.Schema({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//create model based on the schema
const User = new mongose.model("User", userSchema);




app.get("/", function (req, res) {
    res.render("Home");
});
app.get("/register", function (req, res) {
    res.render("register");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/secrets", function(req, res) {
    //login if it is authenticated send them to secret page
    if(req.isAuthenticated()) {
        res.render("secrets");
    }else {
        //if not authenticated send them to login page
        res.redirect("/login");
    }
});

//create register 
 app.post("/register", function (req, res) {
    User.register({username: req.body.username}, req.body.password, function(err, result) {
        if(err) {
            console.log(err);
            res.redirect("/register");
        }else {
            Passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });
}); 

//create login 
 app.post("/login", function (req, res) {
     const user = new User({
         username = req.body.username,
         password = req.body.password
     });

     req.login(user, function(err) {
         if(err) {
             console.log(err);
         }else {
            Passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
         }
     });
    
}); 
//logout
app.get("/logout", function (req, res) {
    req.logout();
    res.render("/");
});










app.listen(3000, function () {
    console.log("Server is working.................");
}); */