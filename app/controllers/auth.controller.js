const config = require("../../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const e = require("express");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    followers: [],
    following: []
  });

  user.save().then((user) => {
    if (req.body.roles) {
      Role.find({name: { $in: req.body.roles }}).then((roles) => {
          user.roles = roles.map(role => role._id);
          user.save().then(() => {
            res.send({ message: "User was registered successfully!" });
          }).catch((err) => {
            res.status(500).send({ message: err });
            console.log(err);
          });
        }
      ).catch((err) => {
        res.status(500).send({ message: err });
        console.log(err);
      });
    } else {
      Role.findOne({ name: "user" }).then((role) => {

        user.roles = [role._id];
        user.save().then(() => {
          res.send({ message: "User was registered successfully!" });
        }).catch((err) => {
          res.status(500).send({ message: err });
          console.log(err);
        });
      }).catch((err) => {
        res.status(500).send({ message: err });
        console.log(err);
      });
    }
  }).catch((err) => {
    res.status(500).send({ message: err });
    console.log(err);
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec().then((user) => {

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = req.body.password === user.password;

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        roles: authorities,
        accessToken: token
      });
    }).catch((err) => {
      res.status(500).send({ message: err });
      console.log(err);
    });
};