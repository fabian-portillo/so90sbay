// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Review = mongoose.model('Review');
var User = mongoose.model('User');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest.agent(app);

describe('Review Route', function () {

  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });
 
  describe('Get All reviews', function () {

     var user, product, review, review1;

      beforeEach(function (done) {
        User.create({
            email: 'email@email.com',
            password: 'emailpassword',
        }, function (err, u) {
          if (err) return done(err);
          user = u;
          done();
        });
      });

      beforeEach(function (done) {
        Product.create({
            title: 'Banana Slicer',
            description: 'A device to slice them all',
            price: 100,
            quantity: 8,
            category: ['major Keys'],
        }, function (err, p) {
          if (err) return done(err);
          product = p;
          done();
        });
      });

      beforeEach(function (done) {
        Review.create([{
            title: 'Bananana',
            body: 'This is the greatest banananana ever',
            rating: 5,
            user: user._id,
            product: product._id
        }, {
            title: 'WOOOHOOOO',
            body: 'Best item ever!!',
            rating: 5,
            user: user._id,
            product: product._id
        }, {
            title: 'ANOTHER ONE',
            body: 'Just wanted to write another review',
            rating: 5
            // user: user._id,
            // product: product._id
        }], function (err, r) {
          if (err) return done(err);
          review = r;
          review1 = r[0];
          done();
        });
      });


    it('should GET ALL reviews', function (done) {
      agent
        .get('/api/review')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an.instanceof(Array);
          expect(res.body).to.have.length(3);
          done();
        });
    });

    it('POST one', function (done) {
        agent
          .post('/api/review')
          .send({
              title: 'Best Review Ever',
              body: 'Test Review Worked, Congrats',
              rating: 3,
              user: user._id,
              product: product._id
          })
          .expect(201)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.title).to.equal('Best Review Ever');
            done();
          });
      });

    it('GET one by user ID', function (done) {
      agent
        .get('/api/review/' + user._id)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an.instanceof(Array);
          expect(res.body).to.have.length(2);
          done();
        });
    });

    it('CAN update a review', function (done) {
      agent
        .put('/api/review/' + review1._id)
        .send({title: 'UPDATED TITLE', body: 'New Review Here'})
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.title).to.equal('UPDATED TITLE');
          done();
        });
    });

    it('can DELETE a review', function (done) {
      agent
        .delete('/api/review/' + review1._id)
        .expect(204)
        .end(function (err, res) {
          if (err) return done(err);
          Review.findById(review1._id, function (err, r) {
            if (err) return done(err);
            expect(r).to.be.null;
            done();
          });
        });
    });

  });



});
