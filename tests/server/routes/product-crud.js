// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');

var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Review = mongoose.model('Review');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

var productAgent = supertest.agent(app);

describe('Products Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});


	describe('All products Route', function () {

		var productInfoOne = {
			title: 'Bop-It',
			description: 'Twist IT!',
			price: 10000,
			quantity: 18,
			category: "games",
			photo: 'http://america.pink/images/7/1/8/3/1/4/en/3-bop.jpg'
		};

		var productInfoTwo = {
			title: 'N64',
			description: 'Mario rules!',
			price: 100,
			quantity: 27,
			category: 'games',
			photo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Nintendo-64-wController-L.jpg'
		};

		var productInfoThree = {
			title: 'Barbie',
			description: "America's sweetheart",
			price: 50,
			quantity: 324,
			category: 'dolls',
			photo: 'http://vignette2.wikia.nocookie.net/barbie-movies/images/1/1f/Barbie_Princess_and_The_Popstar_Tori_Doll.jpg/revision/latest?cb=20130709065952'
		}

		beforeEach('Create multiple products', function (done) {
			Product.create([productInfoOne, productInfoTwo, productInfoThree])
			.then(function(products) {
				done();
			})
			.then(null, done);
		});

		it('should get 200 response and with an array as the body', function (done) {
			productAgent.get('/api/product').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('array');
				done();
			});
		});
	});
	
	describe('Find by id route', function() {

		var productId; 

		var productInfo = {
			title: 'Bop-It',
			description: 'Twist IT!',
			price: 10000,
			quantity: 18,
			category: "games",
			photo: 'http://america.pink/images/7/1/8/3/1/4/en/3-bop.jpg'
		};

		beforeEach('Create example product', function(done){
			Product.create(productInfo)
			.then(function(product){
				productId = product._id;
				done();
			})
			.then(null, done);
		})

		it('should find a single product by id', function(done){
			productAgent.get('/api/product/' + productId).expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body.title).to.equal('Bop-It');
				done();
			})
		})

	})

	// come back to this test after pulling Rafi's updated review model from github
	// describe('get reviews by product id', function(){


	// })

	describe('find products by category string', function(){

		var productOne = {
			title: 'Bop-It',
			description: 'Twist IT!',
			price: 10000,
			quantity: 18,
			category: ["games"],
			photo: 'http://america.pink/images/7/1/8/3/1/4/en/3-bop.jpg'
		};

		var productTwo = {
			title: 'N64',
			description: 'Mario rules!',
			price: 100,
			quantity: 27,
			category: ['games'],
			photo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Nintendo-64-wController-L.jpg'
		};

		beforeEach('Create two products of same category', function (done) {
			Product.create([productOne, productTwo])
			.then(function(products) {
				done();
			})
			.then(null, done);
		});

		it('should return products based upon category', function(done){
			productAgent.get('/api/product/category/games').expect(200).end(function (err, response){
				if (err) return done(err);
				expect(response.body.length).to.equal(2);
				done();
			})
		})

	})

	describe('add new products to catalog through post route', function (){

		var sample = {
			title: 'GameBoy',
			description: 'Games on the go!',
			price: 80,
			quantity: 11,
			category: ['games'],
			photo: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Game-Boy-FL.jpg'
		};

		var adminCreds = {
				email: "joe@fullstack.com",
				password: "password",
				isAdmin: true
			}

		beforeEach('create admin account', function (done) {
			User.create(adminCreds)
				.then( function() { done() }, done );
		})

		it('should create a new product with a post request when the user is an admin', function (done){
			productAgent.post('/login').send(adminCreds)
				.end( function( err, res ) {
					if (err) return done(err);

					productAgent.post('/api/product').send(sample)
					.expect(201).end(function(err, response){
						if (err) return done(err);
						expect(response.body.title).to.equal('GameBoy');
						done();
					});

				});
		})

		it('should not allow unauthorized users to create products', function (done) {
			productAgent.post('/api/product').send(sample)
				.expect(401, done);
		})
	})

	describe('updating existing product', function(){

		var update = {
			title: 'GameBoy Color'
		};

		var sampleId;

		var sampleProduct = {
			title: 'GameBoy',
			description: 'Games on the go!',
			price: 80,
			quantity: 11,
			category: ['games'],
			photo: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Game-Boy-FL.jpg'
		};

		beforeEach('create example product', function (done) {
			Product.create(sampleProduct)
			.then(function(product) {
				sampleId = product._id;
				done();
			})
			.then(null, done)
		})

		var adminCreds = {
				email: "joe@fullstack.com",
				password: "password",
				isAdmin: true
			}

		beforeEach('create admin account', function (done) {
			User.create(adminCreds)
				.then( function() { done() }, done );
		})

		it('should allow admins to update a product', function (done) {
			productAgent.post('/login').send(adminCreds)
				.end( function( err, res ) {

					productAgent.put('/api/product/' + sampleId)
					.send(update).expect(200).end(function(err, response) {
						if (err) return done(err);
						expect(response.body.title).to.equal('GameBoy Color')
						expect(response.body.price).to.equal(80);
						done();
					});

				});
		})

		it('should not allow unauthorized users to update products', function (done) {
			productAgent.put('/api/product/' + sampleId).send(update)
				.expect(401, done);
		})
	})

	describe('delete an existing user', function(){

		var sampleId;

		var sega = {
			title: 'Sega Dreamcast',
			description: 'Sega is Mega!',
			price: 220,
			quantity: 17,
			category: ['games'],
			photo: 'http://segaretro.org/images/8/80/Dreamcast.jpg'
		};

		beforeEach('create example product', function (done) {
			Product.create(sega)
			.then(function(product) {
				sampleId = product._id;
				done();
			})
			.then(null, done)
		})

		var adminCreds = {
				email: "joe@fullstack.com",
				password: "password",
				isAdmin: true
			}

		beforeEach('create admin account', function (done) {
			User.create(adminCreds)
				.then( function() { done() }, done );
		})

		it('should allow admins to remove a product from the database', function(done) {
			productAgent.post('/login').send(adminCreds)
				.end( function( err, res ) {
					if ( err ) return done(err);

					productAgent.delete('/api/product/' + sampleId).expect(204)
					.end(function (err, response){
						if (err) return done(err);
						Product.findById(sampleId, function (err, product) {
							if (err) return done(err);
							expect(product).to.be.null;
							done();
						})
					});

				});

		});

		it('should not allow unauthorized users to delete products', function (done) {
			productAgent.delete('/api/product/' + sampleId)
				.expect(401, done);
		});

	});

});








