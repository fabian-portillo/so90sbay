var mongoose = require( 'mongoose' );
var router = require( 'express' ).Router();
var _ = require( 'lodash' );

var Order = mongoose.model( 'Order' );
var Product = mongoose.model( 'Product' );

function createNewCart( session, user ) {

  console.log( "Creating new cart for session. . ." );
  session.cart = new Order({});
  if ( user ) session.cart.user = user._id;

  // save the cart to the database
  return session.cart.save()
  .then( function( cart ) {

    console.log( "Cart created successfully!" );
    return cart;

  });

}

// attach the user's cart to the request
router.use( '/', function( req, res, next ) {

  if ( req.session.cart === undefined ) {

    var authed = !!req.user;

    // check to see if the user has a persistent cart
    if ( authed && req.user.cart ) {
      
      // find the user's cart and attach it to the session
      Order.findById( req.user.cart ).exec()
      .then( function( userCart ) {

        if ( userCart.paymentInfo ) {

          createNewCart( req.session, req.user )
          .then( function( newCart ) {

            if ( authed ) {
              req.user.cart = newCart._id;

              return req.user.save();
            }

          })
          .then( function() { next(); })
          .then( null, next );

        } else { 

          req.session.cart = userCart;
          next();

        }
      
      }, next );

    } else {

      // create a new cart for this session
      createNewCart( req.session, req.user )
      .then( function( newCart ) {

        if ( authed ) {
          req.user.cart = newCart._id;

          return req.user.save();
        }

      })
      .then( function() { next(); })
      .then( null, next );

    }
  } else {

    return new Promise( function( ok, fail ) {

      if ( req.session.cart.constructor !== Order ) {

        Order.findById( req.session.cart._id )
        .then( function( realCart ) {

          req.session.cart.paymentInfo = realCart.paymentInfo;
          req.session.cart.lineItems = realCart.lineItems;
          req.session.cart.created = realCart.created;
          req.session.cart.paid = realCart.paid;

          return req.session.cart;

        })
        .then( ok, fail );

      } else {

        ok( req.session.cart );

      }

    })
    .then( function( cart ) {

      req.session.cart = cart;

      if ( cart.paymentInfo !== null ) {

        return createNewCart( req.session, req.user )
        .then( function( newCart ) {

          if ( authed ) {
            req.user.cart = newCart._id;

            return req.user.save();
          }

        })
        .then( function() { next(); })
        .then( null, next );

      } else {

        return cart;

      }

    })
    .then( function( cart ) {

      console.dir( cart.lineItems );
      // make sure the line items are populated
      if ( cart.lineItems && cart.lineItems.length ) {

        return Promise.all( cart.lineItems.map( function( li_id ) {
          return Order.LineItem.findById( li_id ).exec();
        }))
        .then( function( lis ) {

          return Promise.all( lis.map( function( li_obj ) {
            if ( li_obj === null ) return null;
            return Product.findById( li_obj.product ).exec();
          }))
          .then( function( prods ) {

            return lis.map( function( li_obj, li_idx ) {

              var product = prods[li_idx];

              if ( ( product ) === null ) {
                return li_obj;
              }

              li_obj.product = prods[li_idx];
              return li_obj;

            })

          })
          .then( null, next );

        })
        .then( function( lis ) {

          cart.lineItems = lis;
          next();

        })
        .then( null, next );
      
      } else {
        next();
      }
    })
    .then( null, next );
  }
});

// GET /cart/ - gets the current session's cart
router.get( '/', function( req, res ) {

  res.status( 200 ).json( req.session.cart );

})

function checkForExistingLineItem( cart, newLi ) {

  return new Promise( function( ok, fail ) {
    var eliIdx = _.findIndex( cart.lineItems, function( li ) {
      return (li.product._id? li.product._id.toString() : li.product.toString()) === newLi.productId;
    }) 

    if ( eliIdx > -1 ) {

      cart.lineItems[eliIdx].quantity += newLi.quantity;
      cart.lineItems[eliIdx].save().then( ok, fail );
    
    } else {

      ok( false );

    }    
  });

}

// POST /cart/ - add an item to the cart
router.post( '/', function( req, res, next ) {

  // validate the request body
  if ( req.body.productId === undefined || req.body.quantity === undefined ) {
    
    var badPostError = new Error( "Malformed POST request when adding to cart: required keys 'productId' and 'quantity' were missing." );
    badPostError.status = 400;
    return next( badPostError );

  }

  // check to see if we already have a line item with that id
  checkForExistingLineItem( req.session.cart, req.body )
  .then( function( foundLi ) {

    var lis = req.session.cart.lineItems || [];

    // if we didn't match an existing item, create a new one
    if ( foundLi === false ) {

      return Product.findById( req.body.productId ).exec()
      .then( function( product ) {
    
        // check that the product exists
        if ( product === null ) {

          var badProductError = new Error( "Product not found" );
          badProductError.status = 400;
          next( badProductError );

        }

        // create a new line item from that product
        return Order.LineItem.fromProduct( req.body.quantity, product )
        .then( function( li ) {

          lis.push( li );
          return lis;

        });
      });
    } else {
      return lis;
    }

  })
  .then( function( lis ) {

    // update the cart
    Order.findByIdAndUpdate( req.session.cart._id, {
      lineItems: lis.slice()
    }, {new: true} )
    .then( function( cart ) {
      res.status( 200 ).json( cart );
    })
    .then( null, next );

  })
  .then( null, next );

});

// PUT / - updates a line item's quantity
router.put( '/', function( req, res, next ) {

  // validate PUT body
  if ( req.body.productId === undefined || req.body.quantity === undefined ) {

    var badPutError = new Error( "Malformed PUT request when modifying cart: required keys 'productId' and 'quantity' were missing" );
    badPutError.status = 400;
    return next( badPutError );
  
  }

  // find the line item with the associated product id
  var lineToChange = req.session.cart.lineItems.reduce( function( match, li ) {
    if ( (li.product._id? li.product._id.toString(): li.product.toString()) === req.body.productId ) return li;
    else return match;
  }, null )

  if ( lineToChange !== null ) {

    lineToChange.quantity = req.body.quantity;
    lineToChange.save()
    .then( function() {

      // reload the cart
      Order.findById( req.session.cart._id ).exec()
      .then( function( cart ) {

        req.session.cart = cart;
        res.status( 200 ).json( cart );

      })

    })

  } else {

    // the product was not found, throw an error
    var emsg = "Product not found in line items (" + req.body.productId + " was not found in " + req.session.cart.lineItems + ")";
    var productNotFoundError = new Error( emsg );
    productNotFoundError.status = 400;
    next( productNotFoundError );
  
  }

});

router.delete( '/:productId', function( req, res, next ) {

  // validate DELETE body
  if ( req.params.productId === undefined ) {

    var badDeleteError = new Error( "Malformed DELETE request when modifying cart: required key 'productId' was missing" );
    badDeleteError.status = 400;
    return next( badDeleteError );

  }

  // find the line to delete
  var lineToDeleteIdx = req.session.cart.lineItems.reduce( function( match, li, idx ) {
    if ( ( li.product._id ? li.product._id.toString() : li.product.toString() ) === req.params.productId ) return idx;
    else return match;
  }, null )

  if ( lineToDeleteIdx !== null ) {

    req.session.cart.lineItems.splice( lineToDeleteIdx, 1 );
    
    Order.findByIdAndUpdate( req.session.cart._id, {
      $set: { lineItems: req.session.cart.lineItems }
    }).populate( 'lineItems' )
    .then( function( cart ) {

      res.status( 200 ).json( cart );

    })

  } else {

    // line not found, throwing error
    var emsg = "Product not found in line items (" + req.params.productId + " was not found in " + req.session.cart.lineItems + ")";
    var lineNotFoundError = new Error( emsg );
    lineNotFoundError.status = 400;
    next( lineNotFoundError );

  }


})

module.exports = router;