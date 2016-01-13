'use strict';
var mongoose = require('mongoose');

var LineItemSchema = mongoose.Schema({

  quantity: Number,
  price: Number,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }

})

LineItemSchema.methods.getExtendedPrice = function() {
  return this.quantity * this.price;
}

LineItemSchema.statics.fromProduct = function( quantity, productId ) {

  return new Promise( function( res, rej ) {

    // if we're given an id, look it up in the database
    if ( productId.constructor === mongoose.Schema.Types.ObjectId || typeof productId === 'string' ) {
      mongoose.model('Product').findById( productId ).exec().then( res );

    // assume that anything else we're passed in might be a product object
    } else {
      if ( productId._id === undefined ) rej( new TypeError( "Incompatible product type:" + productId.constructor.name ) );

      res( productId );
    }

  }).then( function( product ) {
    if ( product === null ) throw new Error( "Product not found" );

    return mongoose.model('Order').LineItem.create({ quantity: quantity, price: product.price, product: product._id });
  }).then( null, function( err ) {
    console.error( "Tried to create a LineItem from a product but got an error:", err );
  })

}

var PaymentInfoSchema = new mongoose.Schema({

  status : {
            type: String,
            default: "Pending"
  },
  shipAddress : {
            type: String,
            required: true
  }

});

var OrderSchema = new mongoose.Schema({

  user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
  },
  lineItems : {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'LineItem'
  },
  paymentInfo : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PaymentInfo',
            default: null
  }

});

OrderSchema.statics.fromLineItems = function( lis, user ) {

  return mongoose.model('Order').create( {
    user : user,
    lineItems : lis,
    paymentInfo : null
  })
  .then( function( order ) {
    return order;
  })
  .then( null, function( err ) {
    console.error( "Tried to create an order from line items but got an error:", err );
  })

}

var Order = mongoose.model( 'Order', OrderSchema );
Order.PaymentInfo = mongoose.model( 'PaymentInfo', PaymentInfoSchema );
Order.LineItem = mongoose.model( 'LineItem', LineItemSchema );

module.exports = Order;
