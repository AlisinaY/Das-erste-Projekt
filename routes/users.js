const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user.js");


//
router.get("/register", function(req, res){
    res.render("register");
});

//
router.post("/register", function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password1 = req.body.password1;

    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();
    req.checkBody("email", "Email is not valid").isEmail();
    req.checkBody("username", "Username is required").notEmpty();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("password1", "Passwords do not match").equals(req.body.password);

    const errors = req.validationErrors();

    if(errors){
        res.render("register", {
            errors: errors,
        });
    } else {
        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                    } else {
                        req.flash("success", "You are now registered can log in");
                        res.redirect("/users/login");
                    }
                });
            });
        });
    }
});

//
router.get("/login", function(req, res){
    res.render("login");
});

// Login Process
router.post("/login", function(req, res, next){
    passport.authenticate('local', {
         successRedirect: "/",
         failureRedirect: '/users/login',
         failureFlash: true
    })(req, res, next);
    res.redirect("/");
});

// Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are logged out now");
    res.redirect("/users/login");
});

module.exports = router;
