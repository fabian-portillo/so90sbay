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

LineItemSchema.statics.fromProduct = function( quantity, product ) {

  if ( product.constructor === mongoose.model('Product') ) {
    return new LineItem({ quantity: quantity, price: product.price, product: product });
  } else if ( product.constructor === mongoose.Schema.Types.ObjectId ) {

    return mongoose.model('Product').findById( product ).exec()
    .then( function( product ) {
      if ( product === null ) return console.error( "Could not find a product with the given product id" );

      return new LineItem({ quantity: quantity, price: product.price, product: product });
    })
    .then( null, function( err ) {
      console.error( "Tried to create a LineItem from a product but got an error:", err );
    })

  } else {
    console.error( "Tried to create a LineItem from unknown product type:", product.constructor.name );
  }

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
