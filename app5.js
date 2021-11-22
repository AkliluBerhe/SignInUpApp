/* //jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const passport = require("passport");


const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));



//connect to mongoDB
mongose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
//create schema
const userSchema = new mongose.Schema({
    email: String,
    password: String
});
//level 1 Encryption
//always encrypt before creating the model 
// and the secret key is in .env file which will be hidden by gitignore
//Level-1: userSchema.plugin(encrypt, { secret: process.env.SECRET, encrytedFields: ["password"] });
//
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

//create register level-2
app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Succesfully create!");
            }
       
    });

});

//create login level-2
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                    if (foundUser.password === password) {
                        res.render("secrets");
                    }
            }
        }
    });
});










app.listen(3000, function () {
    console.log("Server is working.................");
}); */