app.factory('OrderFactory', function ( $http ) {

  var OrderFactory = {};

  OrderFactory.fetchAll = function() {

    return $http.get('/api/orders')
      .then( function( res ) { 
        return res.data;
      })
      .then( null, function( err ) {

        console.log( err );

      });

  }

  OrderFactory.fetchOne = function( id ) {

    return $http.get('/api/orders/' + id.toString())
    .then( function( res ) {
      return res.data;
    })
    .then( null, console.error );

  }

  OrderFactory.update = function( id, data ) {

    if ( data.paymentInfo._id ) delete data.paymentInfo._id;

    return $http.put('/api/orders/' + id.toString(), data )
    .then( function( res ) {
      return res.data;
    })
    .then( null, console.error );

  }

  return OrderFactory;

});
