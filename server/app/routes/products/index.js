var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');

var Product = mongoose.model('Product');
var Review = mongoose.model('Review');
var User = mongoose.model('User');

var adminOnly = function( req, res, next ) {
	if ( req.user && req.user.isAdmin ) {
		next();
	} else {
		res.status(401).end();
	}
}

router.get('/', (req,res,next) => {
	Product.find({})
	.exec()
	.then(function(products){
		res.status(200).json(products);
	})
	.then(null, next);
})

router.get('/:id', (req, res, next) => {
	var id = req.params.id;
	// This will add the product ID to User recommendation history
	if (req.user) {
		User.findById(req.user._id)
			.then(function (user) {
				user.recHistory.push(id);
				user.save();
			})
			.then(null, next);
	}

	Product.findById(id)
	.exec()
	.then(function(product){
		res.status(200).json(product);
	})
	.then(null, next);
})

// temporarily commented out bc Review model not yet hooked up to Products
router.get('/:id/reviews', (req, res, next) => {
	var id = req.params.id;
	Review.find({product: id})
	.exec()
	.then((reviews) => {
		res.status(200).json(reviews);
	})
	.then(null, next);
})

router.get('/category/:category', (req, res, next) => {
	var cat = req.params.category;
	Product.find({category: cat})
	.exec()
	.then((products) => {
		res.status(200).json(products);
	})
	.then(null, next);
})

//make sure req.body.product is correct when testing...
router.post('/', adminOnly, (req, res, next) => {
	Product.create(req.body)
	.then((product) => {
		res.status(201).json(product);
	})
	.then(null, next);
})

router.post('/search', (req, res, next) => {
	var searchInput = req.body.searchInput;
	var regExSearch = new RegExp(searchInput, "i")
	Product.find()
	.or([{title: regExSearch},{category: regExSearch}])
	.then((product) => {
		res.status(200).json(product);
	})
	.then(null, next);
})


//double check this one; not so comfortable with Put requests
router.put('/:id', adminOnly, (req, res, next) => {
	var id = req.params.id;
	var update = req.body;
	Product.findByIdAndUpdate(id, update, {new: true})
	.then((product) => {
		res.status(200).json(product);
	})
	.then(null, next);
})

router.delete('/:id', adminOnly, (req, res, next) => {
	Product.findOne({_id: req.params.id})
	.remove()
	.exec()
	.then((product) => {
		res.status(204).json(product)
	})
	.then(null, next);
})


