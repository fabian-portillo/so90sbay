var mongoose = require( 'mongoose' );
var router = require( 'express' ).Router();

var Order = mongoose.model( 'Order' );
var Product = mongoose.model( 'Product' );

// attach the user's cart to the request
router.use( '/', function( req, res, next ) {

  if ( req.session.cart === undefined ) {

    var authed = !!req.user;

    // check to see if the user has a persistent cart
    if ( authed && req.user.cart ) {
      
      // find the user's cart and attach it to the session
      Order.findById( req.user.cart ).exec()
      .then( function( cart ) {

        req.session.cart = cart;
        next();
      
      }, next );

    } else {

      // create a new cart for this session
      req.session.cart = new Order({});
      if ( authed ) req.session.cart.user = req.user._id;

      // save the cart to the database
      req.session.cart.save()
      .then( function( cart ) {

        // if a user is signed in, persist the cart on their object
        if ( authed ) {

          req.user.cart = cart._id;

          req.user.save()
          .then( function() { next(); }, next );

        } else {
          next();
        } 

      }, next );

    }
  } else {

    // make sure the line items are populated
    if ( req.session.cart.lineItems.length && 
         typeof req.session.cart.lineItems[0] !== "object" ) {
      
      Promise.all( req.session.cart.lineItems.map( function( li_id ) {
        return Order.LineItem.findById( li_id ).exec();
      }))
      .then( function( lis ) {

        req.session.cart.lineItems = lis;
        next();

      })
    
    } else {
      next();
    }

  }

});

// GET /cart/ - gets the current session's cart
router.get( '/', function( req, res ) {

  res.status( 200 ).json( req.session.cart );

})

// POST /cart/ - add an item to the cart
router.post( '/', function( req, res, next ) {

  // validate the request body
  if ( req.body.productId === undefined || req.body.quantity === undefined ) {
    return next( new Error( "Malformed POST request when adding to cart: required keys 'productId' and 'quantity' were missing." ) );
  }

  // find the product specified by productId
  Product.findById( req.body.productId ).exec()
  .then( function( product ) {
    
    // check that the product exists
    if ( product === null ) {

      var err = new Error( "Product not found" );
      err.status = 404;
      next( err );

    }

    // create a new line item from that product
    Order.LineItem.fromProduct( req.body.quantity, product )
    .then( function( li ) {

      var lis = req.session.cart.lineItems || [];
      lis.push( li );

      // update our cart with the new line items
      Order.findByIdAndUpdate( req.session.cart._id, {
        $set: { lineItems: lis }
      })
      .then( function( cart ) {
     
        cart.lineItems = lis;
        res.status( 200 ).json( cart );
     
      }, next );

    });

  })
  .then( null, next );

});

module.exports = router;