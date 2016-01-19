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

describe('Order Route', function () {

  before('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  after('Clear test database', function (done) {
    clearDB(done);
  });

  describe( 'authorization', function () {

    var agent;
    beforeEach('create supertest agents', function() {
      agent = supertest.agent(app);
    });

    it('protects the get all route from non-admins', function (done) {

      agent.get('/api/orders')
        .expect( 401 )
        .end( function( err, res ) {
          if ( err ) return done(err);

          done();

        });

    });

    describe('POST route', function() {

      var mockPayInfo = {
        shipAddress: "123 Fake Street",
        shipCity: "New York",
        shipState: "NY",
        shipZip: "10000",
        shipPhone: "123 456 7890",
        creditCardNum: "1234 5678 9000 0000",
        creditCardExpiration: "12/60",
        creditCardName: "John Doe",
        creditCardSecNum: "123"
      }

      var userCreds = {
        email: 'obama@gmail.com',
        password: 'potus'
      }
      var createdUser;
      beforeEach('create user', function(done) {

        User.create( userCreds )
        .then( function( cu ) {
          createdUser = cu;
          done();
        })
        .then( null, done );

      });

      it('can be paid via the post route', function (done) {

        Order.create({ user: createdUser._id })
        .then( function( order ) {

          agent.post('/login').send(userCreds)
            .end( function( err, res ) {
              if (err) return done(err);

              agent.post('/api/orders/' + order._id).send( mockPayInfo )
                .expect( 200 )
                .end( function( err, res ) {
                  if (err) return done(err);

                  expect( Date.parse( res.body.paid ) ).to.be.closeTo( Date.now(), 1000 );
                  expect( res.body.paymentInfo.status ).to.equal( "Pending" );

                  done();

                });
            });
        });
      });

      it('can\'t be paid twice', function (done) {

        Order.create({ user: createdUser._id })
        .then( function( order ) {

          agent.post('/login').send(userCreds)
            .end( function( err, res ) {
              if (err) return done(err);

              agent.post('/api/orders/' + order._id).send( mockPayInfo )
                .expect( 200 )
                .end( function( err, res ) {
                  if (err) return done(err);

                  agent.post('/api/orders/' + order._id).send({})
                    .expect( 400, done );

                });
            });
        });
      });
    });
  });
});
