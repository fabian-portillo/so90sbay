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

          var orderInfo = {
            user: user
          }

          mongoose.model('Order').create( orderInfo )
          .then( function( order ) {

            expect( order ).to.have.property( 'user' );
            expect( order.user ).to.be.equal( user._id );

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

        var li = new LineItem( 3, 19.99, null );
        expect( li.quantity ).to.be.equal( 3 );
        expect( li.price ).to.be.equal( 19.99 );
        expect( li.product ).to.be.equal( null );

        // test instance methods
        expect( li.getExtendedPrice() ).to.be.equal( 19.99 * 3 );

      });

      it('should have a fromProduct static method', function( done ) {

        mongoose.model('Product').create({ title: "My Product", price: 19.99, quantity: 100, category: ["Test"] })
        .then( function( product ) {

          mongoose.model('Order').LineItem.fromProduct( 3, product )
          .then( function( li ) {

            expect( li.quantity ).to.be.equal( 3 );
            expect( li.price ).to.be.equal( 19.99 );
            expect( li.product ).to.be.equal( product._id );

          });

        });

      });

    });

    it('has a fromLineItems static method', function( done ) {

      var LineItem = mongoose.model('Order').LineItem;
      var li1 = new LineItem(1, 10, null);
      var li2 = new LineItem(3, 20, null)
      var lis = [li1, li2];

      mongoose.model('Order').fromLineItems( lis, null )
      .then( function( order ) {

        expect( order.lineItems[0] ).to.be.similar( li1 );
        expect( order.lineItems[1] ).to.be.similar( li2 );
        expect( order.user ).to.be.equal( null );

      });

    });

});
