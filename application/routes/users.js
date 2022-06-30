var express = require('express');
var router = express.Router();
var db = require("../conf/database");
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const UserError = require("../helpers/error/UserError");
const UserModel = require("../models/Users");

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.cpassword;

  //validation
  var pass = true;
  
  if (username[0].match(/[a-zA-z]/i) == null){
    errorPrint("Enter a username that begins with a character.");
    pass = false;
  }
  if (username.match(/(.*[a-zA-Z0-9].*){3}/gi) == null){
    errorPrint("Enter a username that is 3 or more alphanumeric characters.");
    pass = false;
  }
  if (password.match(/(?=.*[A-Z])(?=.*\d)(?=.*[-/*+!@#$^&])[A-Za-z\d-/*+!@#$^&]{8}/gi) == null){
    errorPrint("enter a password that is 8 or more characters AND contains at least 1 upper case letter AND 1 number and 1 of the following special characters.");
    pass = false;
  }
  if (password.match(cpassword) == null){
    errorPrint("the password and confirm password inputs should be the same.");
    pass = false;
  }
  /*if (username.charCodeAt() < 65 || (username.charCodeAt() > 90 && username.charCodeAt() < 97) || username.charCodeAt() > 122){
    errorPrint("Enter a username that begins with a character.");
    pass = false;
  }
  for(var i=0; i<username.length; i++)
    if (username.length < 3 || username.charCodeAt(i) < 48 || (username.charCodeAt(i) > 57 && username.charAt(i) < 65)
    || (username.charCodeAt(i) > 90 && username.charAt(i) < 97) || username.charAt(i) > 122){
      errorPrint("Enter a username that is 3 or more alphanumeric characters.");
      pass = false;
      break;
    }
  var bU = false; // bool Upper case letter
  var bN = false; // bool Number
  var bS = false; // bool Special character
  for(var i=0; i<password.length; i++){
    if(password.charCodeAt(i) >= 65 || password.charCodeAt(i) <= 90) bU = true;
    if(password.charCodeAt(i) >= 48 || password.charCodeAt(i) <= 57) bN = true;
    if(password.charCodeAt(i) == 45 || password.charCodeAt(i) == 47 || password.charCodeAt(i) == 42 || password.charCodeAt(i) == 43 || password.charCodeAt(i) == 33
    || password.charCodeAt(i) == 64 || password.charCodeAt(i) == 35 || password.charCodeAt(i) == 36 || password.charCodeAt(i) == 94 || password.charCodeAt(i) == 38) bS = true;
    
    errorPrint("" + username.charCodeAt(i));
  }

  if (password.length < 8 || !bU || !bN || !bS){
    errorPrint("enter a password that is 8 or more characters AND contains at least 1 upper case letter AND 1 number and 1 of the following special characters.");
    errorPrint("bU: " + bU);
    errorPrint("bN: " + bN);
    errorPrint("bS: " + bS);
    pass = false;
  }
  if (password != cpassword){
    errorPrint("the password and confirm password inputs should be the same.");
    pass = false;
  }
  */
  if (pass) successPrint("Succeed to server side validation");
  else {
    errorPrint("Failed to server side validation");
    req.flash('error', "Failed to server side validation");
    res.redirect("/registration");
    return;
  }

  UserModel.usernameExists(username)
  .then((userNameDoesExist) => {
    if (userNameDoesExist) throw new UserError("Registration Failed: Username already exists", "/registration", 200);
    else return UserModel.emailExists(email);
  })
  .then((emailDoesExist) => {
    if (emailDoesExist) throw new UserError("Registration Failed: Email already exists", "/registration", 200);
    else return UserModel.create(username, password, email);
  })
  .then((createdUserId) => {
    if (createdUserId < 0) throw new UserError("Server Error, user could not be created", "/registration", 500);
    else {
      successPrint("User.js --> user was created");
      req.flash('success', 'User account has been created!');
      res.redirect('/login');
    }
  })
  .catch((err) => {
    errorPrint("Error: User could not be created", err);
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect("/registration");
    } else next(err);
  });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  //validation
  if(username.length == 0 || password.length == 0) {
    errorPrint("Username and/or Password is empty");
    req.flash('error', "Username and/or Password is empty");
    res.redirect('/login');
  }

  UserModel.authenticate(username, password)
  .then((loggedUserId) => {
    if (loggedUserId > 0) {
      successPrint(`User ${username} is logged in`);
      req.session.username = username;
      req.session.userId = loggedUserId;
      res.locals.logged = true;
      req.flash('success', 'You have been successfully logged in!');
      res.redirect("/");
    } else throw new UserError("invalid username and/or password", "/login", 200);
  })
  .catch((err) => {
    errorPrint("User login failed");
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect('/login');
    } else next(err);
  })
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint("Session could not be destroyed");
      next(err);
    } else {
      successPrint("Session was destroyed");
      res.clearCookie('csid');
      res.json({ status: "OK", message: "user is logged out" });
    }
  })
});

module.exports = router;
