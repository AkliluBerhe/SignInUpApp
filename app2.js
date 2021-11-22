//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");

//level 2 bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10; 

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
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Succesfully create!");
            }
        });
    });

}); 

//create login level-2
 app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = (req.body.password);

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                // Load and compare hash from your password DB.
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    // result == true
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            }
        }
    });
}); 










app.listen(3000, function () {
    console.log("Server is working.................");
});