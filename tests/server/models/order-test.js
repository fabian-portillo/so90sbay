var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Order = mongoose.model('Order');

describe('Order model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Order).to.be.a('function');
    });

    it('should be able to be associated with a User or a guest session', function(done) {
        // test association with a guest

        // test association with a user
        mongoose.model('User').create({ email: "test@test.com", password: "12345678" })
        .then( function( user ) {

          console.log( 'user created');

          var orderInfo = {
            user: user
          }

          mongoose.model('Order').create( orderInfo )
          .then( function( order ) {

            console.log( 'order created')

            expect( order ).to.have.property( 'user' );
            expect( order.user ).to.be.equal( user );

            done();

          })

        })
        .then( null, done );

    });

    describe('line items', function () {

      var LineItem = mongoose.model('Order').LineItem;

      it('should exist', function() {
        expect( LineItem ).to.be.a( 'function' );
      });

      it('should have the right properties and methods', function() {

        var li = new LineItem( { quantity: 3, price: 19.99, product: null } );
        expect( li.quantity ).to.be.equal( 3 );
        expect( li.price ).to.be.equal( 19.99 );
        expect( li.product ).to.be.equal( null );

        // test instance methods
        expect( li.getExtendedPrice() ).to.be.equal( 19.99 * 3 );

      });

      xit('should have a fromProduct static method', function( done ) {

        var product = {
          _id : new mongoose.Types.ObjectId( "12345678901234567890abcd" ),
          price : 19.99
        }

        mongoose.model('Order').LineItem.fromProduct( 3, product )
        .then( function( li ) {

          expect( li.quantity ).to.be.equal( 3 );
          expect( li.price ).to.be.equal( 19.99 );
          expect( li.product ).to.be.equal( product._id );

        });

      });

    });

    it('has a fromLineItems static method', function( done ) {

      var LineItem = mongoose.model('Order').LineItem;
      var li1 = new LineItem({ quantity: 1, price: 10, product: null });
      var li2 = new LineItem({ quantity: 3, price: 20, product: null });

      mongoose.model('Order').fromLineItems( [li1, li2], null )
      .then( function( order ) {

        expect( order ).to.have.property( 'lineItems' );
        expect( order.lineItems.length ).to.be.equal( 2 );
        expect( order.user ).to.be.equal( null );

        done();

      })
      .then( null, done );

    });

});
