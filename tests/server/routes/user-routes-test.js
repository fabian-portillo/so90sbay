//TODO: test for getting  user's reviews and previous orders
// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Review = mongoose.model('Review');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('User Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});


	describe('Get all users request', function () {

		var userAgent;

		var userOne = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop',
			isAdmin: true
		};

		var userTwo = {
			email: 'will@gmail.com',
			password: 'freshprince'
		};

		var userThree = {
			email: 'simba@gmail.com',
			password: 'lionking'
		};

		var createdUsers;

		beforeEach('Create users', function (done) {
			User.create([userOne, userTwo, userThree])
			.then((users)=>{
				createdUsers = users;
				done();
			})
			.then(null, done)
			userAgent = supertest.agent(app);
		});


		it('should get all users', function (done) {
			userAgent
			.get('/api/user/')
			.expect(200)
			.end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('array');
				expect(response.body).to.have.property('length').to.equal(3);
				done();
			});
		});


		it('should create a new user', function (done) {
			userAgent
			.post('/api/user/')
			.send({user: {
					email: 'test@gmail.com',
					password: 'testpassword'
				}})
			.expect(201)
			.end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('object');
				expect(response.body.email).to.equal("test@gmail.com");
				done();
			});
		});

		it('should get user by ID', function (done) {
			userAgent
			.get('/api/user/' + createdUsers[0]._id)
			.expect(200)
			.end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('object');
				expect(response.body.email).to.equal("joe@gmail.com");
				done();
			});
		});

		it('should allow users to update themselves', function (done) {
			userAgent.post('/login').send({
				email: userTwo.email,
				password: userTwo.password
			})
				.end( function( err, res ) {

					userAgent
					.put('/api/user/' + createdUsers[1]._id)
					.send({
							email: 'updatedemail@gmail.com'
						})
					.expect(200)
					.end(function (err, response) {
						if (err) return done(err);
						expect(response.body).to.be.an('object');
						expect(response.body.email).to.equal("updatedemail@gmail.com");
						done();
					});
				
				});
		});

		it('should not allow users to change their admin status', function (done) {
			userAgent.post('/login').send({
				email: userTwo.email,
				password: userTwo.password
			})
				.end( function( err, res ) {

					userAgent
					.put('/api/user/' + createdUsers[1]._id)
					.send({
							email: 'updatedemail@gmail.com',
							isAdmin: true
						})
					.expect(200)
					.end(function (err, response) {
						if (err) return done(err);
						expect(response.body).to.be.an('object');
						expect(response.body.email).to.equal("updatedemail@gmail.com")
						expect(response.body.isAdmin).to.equal(false);
						done();
					});
				
				});
		});

		it('should allow admins to update other users', function (done) {
			userAgent.post('/login').send({
				email: userOne.email,
				password: userOne.password
			})
				.end( function( err, res ) {
					if ( err ) return done( err );

					userAgent
					.put('/api/user/' + createdUsers[2]._id)
					.send({
						email: 'updatedemail@gmail.com'
					})
					.expect(200)
					.end( function ( err, res ) {
						if (err) return done(err);
						expect(res.body).to.be.an('object');
						expect(res.body.email).to.equal("updatedemail@gmail.com");
						done();
					});

				});
		});

		it('should not allow unauthorized users to update other users', function (done) {
			userAgent.put('/api/user/' + createdUsers[0]._id)
				.send({
					email: 'updatedemail@gmail.com',
				})
				.expect(401)
				.end( function( err, res ) {

					userAgent.post('/login').send({
						email: userTwo.email,
						password: userTwo.password
					})
						.end( function( err, res ) {

							userAgent.put('/api/user/' + createdUsers[0]._id)
								.send({
									email: 'updatedemail@gmail.com'
								})
								.expect(401, done);

						});

				});
		});

		it('should allow users to delete themselves', function (done) {
			userAgent.post('/login').send({
				email: userTwo.email,
				password: userTwo.password
			}).end( function ( err, res ) {
				if (err) return done(err);

				userAgent
				.delete('/api/user/' + createdUsers[1]._id)
				.expect(204)
				.end(function (err, res) {
					if (err) return done(err);
					User.findById(createdUsers[1]._id, function (err, user) {
						if (err) return done(err);
						expect(user).to.be.null;
						done();
					});
				});

			});
		});

		it('should allow admins to delete other users', function (done) {
			userAgent.post('/login').send({
				email: userOne.email,
				password: userOne.password
			}).end( function( err, res ) {
				if (err) return done(err);

				userAgent.delete( '/api/user/' + createdUsers[1]._id )
					.expect( 204 )
					.end( function( err, res ) {
						if (err) return done(err);
						User.findById(createdUsers[1]._id, function ( err, user ) {
							if (err) return done(err);
							expect(user).to.be.null;
							done();
						});
					});

			});
		});

		it('should not allow users to delete each other', function (done) {
			userAgent.delete( '/api/user/' + createdUsers[1]._id )
				.expect( 401, done );
		});

	});

});
