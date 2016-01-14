//TODO: GET previous orders
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');

var User = mongoose.model( 'User' );
var Review = mongoose.model( 'Review' );

router.param('id', function ( req, res, next, id ) {

	User.findById( id )
		.then( function( user ) {
			req.foundUser = user;
			next();
		})
		.then( null, next )

})

var adminOrSelfOnly = function( req, res, next ) {

	if ( req.user && req.user.isAdmin ) {
		next();
	} else if ( req.user && req.user._id.toString() === req.foundUser._id.toString() ) {
		next();
	} else {
		res.status( 401 ).end();
	}

}

router.get('/', (req,res,next) => {
	User.find({}).exec()
	.then((users) => {
 		res.status(200).json(users);
 	})
 	.then(null, next)
})


// CHECK OVER THIS ROUTE --> LINTER GIVES US A WARNING ABOUT "NEXT"
// SO I REMOVED "NEXT" -Rafi
router.get('/:id', (req,res) => {
	res.status(200).json( req.foundUser );
})

router.get('/:id/reviews', (req,res,next) => {
	Review.find({user: req.foundUser._id}).exec()
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

router.put('/:id', adminOrSelfOnly, (req,res,next) => {
	var update = req.body;
	var userId = req.params.id;
	User.findByIdAndUpdate(userId, update)
	.then((user) => {
		return User.findOne(user._id)
	})
	.then((user) => {
		res.status(200).json(user);
	})
 	.then(null, next)
})

router.delete('/:id', adminOrSelfOnly, (req,res,next) => {
	var userId = req.params.id;
	User.findOne({_id: userId}).remove().exec()
	.then(() => {
		res.status(204).end();
	})
 	.then(null, next)
})

