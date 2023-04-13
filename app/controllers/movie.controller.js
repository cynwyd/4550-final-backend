const axios = require('axios');
const db = require("../models");
const Review = db.review;
const User = db.user;

exports.getMovieByTitle = (req, res) => {
  if(!req.query.q) {
    res.status(500).send({message: "Missing title"});
    return;
  }

  axios.get(`https://www.omdbapi.com/?t=${req.query.q}&apikey=${process.env.APIKEY}`).then((response) => {
    res.send(response.data);
  }).catch((err) => {
    res.status(500).send({message: err});
    console.log(err);
  })
}

exports.getMovieByID= (req, res) => {
  if(!req.query.q) {
    res.status(500).send({message: "Missing ID"});
    return;
  }
  axios.get(`https://www.omdbapi.com/?i=${req.query.q}&apikey=${process.env.APIKEY}`).then((response) => {
    res.send(response.data);
  }).catch((err) => {
    res.status(500).send({message: err});
    console.log(err);
  })
}

exports.searchMoviesByTitle = (req, res) => {
  if(!req.query.q) {
    res.status(500).send({message: "Missing title"});
    return;
  }

  axios.get(`https://www.omdbapi.com/?s=${req.query.q}&apikey=${process.env.APIKEY}`).then((response) => {
    res.send(response.data);
  }).catch((err) => {
    res.status(500).send({message: err});
    console.log(err);
  })
}