//var express = require('express');
//const routes = new Router();
const Models = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = Models.User;
dotenv.config();

/* GET users listing. */
/*exports.test = function(req, res, next) {
  res.send('respond with a resource');
};*/

//post
exports.register = async (req, res, next) => {
  try {

    const salt = await bcrypt.genSalt(10);
    var usr = {
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      gender: req.body.gender,
      role: req.body.role,
 
      password: await bcrypt.hashSync(req.body.password, salt),
    };
    created_user = await User.create(usr);
 
    res.redirect("/login");
       //res.status(201).json(created_user);
    //console.log("User registered successfully!")
    //res.status(201).json({ message: "User registered successfully" });
    //console.log(req.body)
    // return res.redirect('/')
  } catch (err) {
    // console.log(error.errors)
    const validationErrors = Object.keys(error.errors).map(
      (key) => error.errors[key].message
    );
    req.flash("validationErrors", validationErrors);
    req.flash("data", req.body);
    res.status(500).json({ error: "An error occurred" });
    //return res.redirect('/register')
  }
};

exports.registerpage = (req, res) => {
  let first_name = "";
  let last_name = "";
  let username = "";
  let email = "";
  let password = "";
  //const datadate = new Date()
  //let datadate = "";
  let data = req.flash("data")[0];

  if (typeof data != "undefined") {
    first_name = data.first_name;
    last_name = data.last_name;
    username = data.username;
    email = data.email;
    password = data.password;
  }
  res.render("register", {
    errors: req.flash("validationErrors"),
    first_name: first_name,
    last_name: last_name,
    username: username,
    email: email,
    password: password,
  });
};

exports.loginpage = (req, res) => {
  res.render("login");
};

exports.login = async (req, res, next) => {
  //  const { username, password } = req.body;
  const user = await User.findOne({ where: { email: req.body.email } });
  console.log(user);
  if (user) {
    const password_valid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (password_valid) {
      token = jwt.sign(
        { id: user.id, email: user.email, first_name: user.first_name },
        process.env.SECRET
      );
      //console.log(token);
      // res.status(200).json({ token : token });
      req.session.userId = user.id;
      res.redirect("/home");
      //res.json({ message: 'Login successful' });
   
    } else {
      res.redirect("/login",)
      //res.status(400).json({ error: "Password Incorrect" });
    }
  } else {
    res.redirect("/login",)
    //res.status(404).json({ error: "User does not exist" });
  }
};

exports.loginpagecheck = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    //console.log(user);
    if (user) {
      let cmp = bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          //console.log(user.role);
          if (user.role === "User") {
            req.session.userId = user._id;
            res.redirect("/home");
          } else if (user.role === "Admin") {
            req.session.userId = user._id;
            res.redirect("/admin");
          } else {
            res.redirect("/login");
          }
        } else {
          res.redirect("/login");
        }
      });
    } else {
      res.redirect("/login");
    }
  });
};

(exports.me = async (req, res, next) => {
  try {
    let token = req.headers["authorization"].split(" ")[1];
    let decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Couldnt Authenticate" });
  }
}),
  async (req, res, next) => {
    let user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    });
    if (user === null) {
      res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  };

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
  //.json({ message: "Logout successful" });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
  //res.json({ message: "Logout successful" });
};

exports.edit = async (req, res) => {
  const userId = req.params.id;
  const { username,first_name,last_name,gender } = req.body;
  const role = req.body.role || 'User';
  const user = await User.findByPk(userId);

  if (user) {
    user.username = username;
    user.first_name = first_name;
    user.last_name = last_name;
    user.gender = gender;
    user.role = role;
    user.updatedAt = new Date();
    await user.save();
    if(user.role==="User"){
    res.redirect("/profile");
    }else if(user.role==="Admin"){
      res.redirect("/profile/admin");
  } else {
    res.status(404).send('Post not found');
  }
}
};

exports.delete = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  if (user) {
    req.session.destroy();
    await user.destroy();
    res.redirect(`/login`);
  } else {
    res.status(404).send('Post not found');
  }
};

