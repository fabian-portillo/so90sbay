//TODO: GET previous orders
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');

var User = mongoose.model( 'User' );
var Review = mongoose.model( 'Review' );
var Order = mongoose.model( 'Order' );

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
		//Added a map function so that we are only returning users' emails and id
		users = users.map(function (user) {
			return {_id: user._id, email: user.email}
		})
 		res.status(200).json(users);
 	})
 	.then(null, next)
})

router.get('/:id', (req,res) => {
	//changed this so that it only sends back the email and id of the user
	res.status(200).json( {_id: req.foundUser._id, email: req.foundUser.email} );
})

router.get('/:id/reviews', (req,res,next) => {
	Review.find({user: req.foundUser._id}).exec()
	.then((reviews) => {
		res.status(200).json(reviews);
	})
 	.then(null, next)
})

router.get('/:id/orders', function (req, res, next) {

	if ( req.foundUser._id.toString() !== req.user._id.toString() && !req.user.isAdmin ) {

		var err = new Error( "Cannot view another user's order history" );
		err.status = 401;
		return next( err );

	}

	Order.find({user: req.foundUser._id}).exec()
	.then( function (orders) {
		res.status(200).json(orders);
	})
	.then( null, next );

});

router.post('/', (req,res,next) => {
	var newUser = req.body.user;
	User.create(newUser)
	.then((user) => {
 		res.status(201).json(user);
 	})
 	.then(null, next)
})

router.put('/:id', adminOrSelfOnly, (req,res,next) => {
	if (req.body.isAdmin === true && req.user.isAdmin !== true) req.body.isAdmin = false;
	var update = req.body;
	var userId = req.params.id;
	User.findByIdAndUpdate(userId, update, {new: true})
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

