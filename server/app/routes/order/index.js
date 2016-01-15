var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');

var Order = mongoose.model( 'Order' );

var adminOnly = function( req, res, next ) {

  if ( req.user && req.user.isAdmin ) {
    next()
  } else {
    res.status( 401 ).end();
  }

}

router.param('id', function ( req, res, next, id ) {

  if ( !req.user ) return res.status( 401 ).end();

  Order.findById( id )
  .then( function( order ) {

    if ( order === null ) return res.status( 404 ).end();

    // you cannot look up another user's order via the order API
    if ( order.user._id.toString() === req.user._id.toString() || req.user.isAdmin ) {
      req.order = order;
      next();
    } else {
      res.status( 401 ).end()
    }

  })
  .then( null, next );

});

router.get('/', adminOnly, function ( req, res, next ) {

  Order.find().populate('lineItems paymentInfo').exec()
  .then( function( orders ){
    res.status(200).json(orders);
  })
  .then( null, next );

});

router.get('/:id', function ( req, res ) {
  res.status(200).json( req.order );
});

router.delete('/:id', adminOnly, function ( req, res, next ) {

  req.order.remove()
  .then( function() {
    res.status(204).end();
  })
  .then( null, next );

});