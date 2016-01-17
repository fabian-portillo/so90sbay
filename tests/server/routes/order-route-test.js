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

  });

});
