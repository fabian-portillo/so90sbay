//TODO: GET previous orders
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');

var User = mongoose.model( 'User' );
var Review = mongoose.model( 'Review' );

router.get('/', (req,res,next) => {
	User.find({}).exec()
	.then((users) => {
 		res.status(200).json(users);
 	})
 	.then(null, next)
})

router.get('/:id', (req,res,next) => {
	var userId = req.params.id;
	User.findOne({_id: userId})
	.then((user) => {
 		res.status(200).json(user);
 	})
 	.then(null, next)
})


router.get('/:id/reviews', (req,res,next) => {
	var userId = req.params.id;
	Review.find({user: userId}).exec()
	.then((reviews) => {
		res.status(200).json(reviews);
	})
 	.then(null, next)
})



router.post('/', (req,res,next) => {
	var newUser = req.body.user;
	User.create(newUser)
	.then((user) => {
 		res.status(201).json(user);
 	})
 	.then(null, next)
})

router.put('/:id', (req,res,next) => {
	var update = req.body.update;
	var userId = req.params.id;
	User.findOne(userId)
	.then((user) => {
		return user.update(update)
	})
	.then(() => {
		return User.findOne(userId)
	})
	.then((user) => {
		res.status(200).json(user);
	})
 	.then(null, next)
})

router.delete('/:id', (req,res,next) => {
	var userId = req.params.id;
	User.findOne({_id: userId}).remove().exec()
	.then((user) => {
		res.status(204).end();
	})
 	.then(null, next)
})

