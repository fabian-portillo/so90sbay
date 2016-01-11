var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');

describe('Product model', function() {

    beforeEach('Establish DB connection', function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    it('should exist', function() {
        expect(Product).to.be.a('function');
    });

describe('successful creation', function() {

    var createProduct = function() {
        return Product.create({
            title: 'n64',
            description: "The sweetest 90s video game console",
            price: 200,
            quantity: 100,
            category: ["video games"]
        });
    };

    it('should have the right info', function(done) {
        createProduct().then(function(product) {
            // var sanitizedProduct = product.sanitize();
            expect(product.title).to.equal('n64');
            expect(product.description).to.equal('The sweetest 90s video game console');
            expect(product.price).to.equal(200);
            expect(product.quantity).to.equal(100);
            done();
        });
    });

    it('should insert a placeholder photo if none are included', function(done) {
        createProduct().then(function(product) {
            expect(product.photo[0]).to.equal("https://media.giphy.com/media/WW00AYYAyb2YE/giphy.gif");
            done();
        });

    });



});

describe('throws errors if required fields are missing', function() {

    var createProduct = function() {
        return Product.create({
            title: 'n64',
            description: "The sweetest 90s video game console",
            price: 200,
            quantity: 100
        });
    };

    it('should throw an error if no category is created', function(done) {

        createProduct().then(function(product) {
        })
        .then(null, function(err){
            expect(err.name).to.equal('ValidationError');
            done();
        })
    });


});


});

