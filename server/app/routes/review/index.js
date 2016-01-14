'use strict'

var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
require('../../../db/models');
var Review = mongoose.model('Review');
var _ = require('lodash');


router.get('/', function (req, res, next) {
  Review.find({}).exec()
    .then(function (reviews) {
      res.status(200).json(reviews);
    })
    .then(null, next);
});

router.get('/:id', function (req, res, next) {
  //change user to product for product routes
  Review.find({user: req.params.id})
  .then(function (reviews) {
    res.status(200).json(reviews);
  })
  .then(null, next);
});

router.post('/', function (req, res, next) {
  Review.create(req.body)
    .then(function (review) {
      res.status(201).json(review);
    })
    .then(null, next);
});

router.put('/:id', function (req, res, next) {
  Review.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(function (review) {
      review.save()
        .then(function (review) {
          console.log("after save", review)
          res.status(200).json(review);
        })
    })
    .then(null, next);
});

router.delete('/:id', function (req, res, next) {
  Review.remove({_id: req.params.id})
    .then(function () {
      res.status(204).end();
    })
    .then(null, next);
});


