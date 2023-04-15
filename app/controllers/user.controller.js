const db = require("../models");
const { ObjectId } = require("mongodb");
const Review = db.review;
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.updateUser = (req, res) => {
  if (req.userId != req.params.id) {
    console.log(req.userID);
    console.log(req.params.id);
    res.status(500).send({ message: "Unauthorized" });
    return;
  }
  const userID = req.params.id;
  const email = req.body.email;
  const phone = req.body.phone;
  if (!userID || !email || !phone) {
    res.status(500).send({ message: "Missing fields" });
    return;
  }
  User.findOne({ _id: userID })
    .then((user) => {
      user.email = email;
      user.phone = phone;
      user
        .save()
        .then((newUser) => {
          const userInfo = {
            email: newUser.email,
            phone: newUser.phone,
          };
          res.send({ newUserInfo: userInfo });
          return;
        })
        .catch((err) => {
          res.status(500).send({ message: "Error saving user info" });
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(500).send({ message: "Could not locate user" });
      return;
    });
};

exports.getUser = (req, res) => {
  const userID = req.params.id;
  if (!userID) {
    res.status(500).send({ message: "Missing fields" });
    return;
  }
  User.findOne({ _id: userID })
    .then((user) => {
      const publicUserInfo = {
        id: user._id,
        username: user.username,
      };
      var follower_ids = user.followers.map(function (id) {
        return new ObjectId(id);
      });
      var following_ids = user.following.map(function (id) {
        return new ObjectId(id);
      });

      User.find({ _id: { $in: follower_ids } }, { username: 1 })
        .then((followers) => {
          console.log(followers);
          publicUserInfo.followers = followers;
          User.find({ _id: { $in: following_ids } }, { username: 1 })
            .then((following) => {
              console.log(following);
              publicUserInfo.following = following;
              res.send({ userInfo: publicUserInfo });
              return;
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({ message: "Error getting following" });
              return;
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ message: "Error getting followers" });
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Could not locate user" });
      return;
    });
};

exports.followUser = (req, res) => {
  const userID = req.userId;
  if (!userID || !req.params.id) {
    res.status(500).send({ message: "Missing fields" });
    return;
  }

  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user.followers.includes(userID)) {
        user.followers = user.followers.filter((user) => user != userID);
      } else {
        user.followers.push(userID);
      }
      user
        .save()
        .then((user) => {
          User.findOne({_id: userID}).then((currentUser) => {
            if (currentUser.following.includes(req.params.id)) {
              currentUser.following = currentUser.following.filter((followingID) => followingID != req.params.id);
            } else {
              currentUser.following.push(req.params.id);
            }
            currentUser.save().then((currentUserSaved) => {
              const publicUserInfo = {
                id: user._id,
                username: user.username,
              };
              var follower_ids = user.followers.map(function (id) {
                return new ObjectId(id);
              });
              var following_ids = user.following.map(function (id) {
                return new ObjectId(id);
              });
    
              User.find({ _id: { $in: follower_ids } }, { username: 1 })
                .then((followers) => {
                  console.log(followers);
                  publicUserInfo.followers = followers;
                  User.find({ _id: { $in: following_ids } }, { username: 1 })
                    .then((following) => {
                      console.log(following);
                      publicUserInfo.following = following;
                      res.send({ userInfo: publicUserInfo });
                      return;
                    })
                })
            });
          });
        })
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      console.log(err);
    });
};
