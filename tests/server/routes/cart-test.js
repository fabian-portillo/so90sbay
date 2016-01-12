// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Order = mongoose.model('Order');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Cart Route', function () {

  before('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  after('Clear test database', function (done) {
    clearDB(done);
  });

  describe('session behavior', function() {

    var agent;
    beforeEach('Create agent', function () {
      agent = supertest.agent(app);
    });

    it('creates a cart that persists across sessions', function (done) {

      var expectedId;

      agent.get('/api/cart')
        .expect( 200 )
        .end( function( err, res ) {
          if ( err ) return err;

          expectedId = JSON.parse( res.text )._id;

          agent.get('/api/cart')
            .expect( function( res ) {

              var cart = JSON.parse( res.text );
              if ( cart._id !== expectedId )
                return "Expected id: " + expectedId + ", got id: " + cart._id;

            })
            .end( done ); 

        });

    });

    it('shares a cart between guest and user sessions', function ( done ) {

      var expectedId;
      var userinfo = {
        email: 'test@test.com',
        password: '1234abcd'
      }

      User.create(userinfo).then( function( user ) {
      
        agent.get('/api/cart')
          .expect( 200 )
          .end( function( err, res ) {
            if ( err ) return err;

            expectedId = JSON.parse( res.text )._id;

            agent.post('/login').send(userinfo).end( function( err, res ) {
              if ( err ) return err;

              agent.get('/api/cart')
                .expect( function( res ) {

                  var cart = JSON.parse( res.text );
                  if ( cart._id !== expectedId )
                    return "Expected id: " + expectedId + ", got id: " + cart._id;

                })
                .end( done );

            });

          });

      });

    });

  });

  describe( 'API routes', function() {

    var agent;
    beforeEach('Create agent', function () {
      agent = supertest.agent(app);
    });

    var product;
    beforeEach('Create a product', function(done) {

      var productInfo = {
        title: "Moon Shoes",
        price: 19.99,
        quantity: 100,
        category: ['toys']
      }

      mongoose.model('Product').create(productInfo)
      .then( function( p ) { 

        product = p;
        done();

      }, done );

    });

    it('can add items to a cart and retrieve the cart with those items saved', function( done ) {

      var postData = {
        productId: product._id,
        quantity: 3
      }

      agent.post('/api/cart').send(postData)
        .expect( 200 )
        .end( function( err, res ) {
          if ( err ) return err;

          agent.get('/api/cart')
            .expect( 200 )
            .expect( function( res ) {

              var cart = JSON.parse( res.text );
              if ( cart.lineItems.length <= 0 )
                return "Cart is empty";

              if ( cart.lineItems[0].quantity !== 3 )
                return "Line item has the wrong quantity of items ("
                  + "expected:3, got:" + cart.lineItems[0].quantity + ")";

              if ( cart.lineItems[0].price !== 19.99 )
                return "Line item has the wrong price";

            })
            .end(done)

        });

    });

    it('can update items on a cart and retrieve the cart with those items updated', function( done ) {

      var postData = {
        productId: product._id,
        quantity: 3
      };

      var putsData = {
        productId: product._id,
        quantity: 1
      };

      agent.post('/api/cart').send(postData)
        .expect( 200 )
        .end( function( err, res ) {
          if ( err ) return err;

          agent.put('/api/cart').send(putsData)
            .expect( 200 )
            .expect( function( res ) {

              var cart = JSON.parse( res.text );
              if ( cart.lineItems[0].quantity !== 1 )
                return "Line item has the wrong quantity of items ("
                  + "expected:1, got:" + cart.lineItems[0].quantity + ")";

            })
            .end(done)

        });

    });

    it('can remove items from a cart', function(done) {

      var postData = {
        productId: product._id,
        quantity: 3
      };

      var deleteData = {
        productId: product._id
      }

      agent.post('/api/cart').send(postData)
        .expect( 200 )
        .end( function( err, res ) {
          if ( err ) return err;

          agent.delete('/api/cart').send(deleteData)
            .expect( 200 )
            .expect( function( res ) {

              var cart = JSON.parse( res.text );
              if ( cart.lineItems[0].length )
                return "Expected cart to be empty but it wasn't";

            })
            .end(done)

        });

    });

  });

});
