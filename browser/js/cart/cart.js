app.config( function ( $stateProvider ) {

  $stateProvider.state( 'cart', {

    url: '/cart',
    templateUrl: '/js/cart/cart.html',
    controller: 'CartCtrl',
    resolve: {
      'cart' : function( Cart ) {
        return Cart.fetch();
      }
    }

  });

}).controller( 'CartCtrl', function( $scope, $state, cart, Cart ) {

  var refreshCart = function( newCart ) {
    $scope.cart = newCart;
  }

  refreshCart( cart );

  $scope.editLine = function( line ) {
    Cart.edit( line.quantity, line.product )
    .then( refreshCart );
  }

  $scope.deleteLine = function( line ) {
    Cart.remove( line.product )
    .then( refreshCart );
  }

  $scope.openCheckout = function() {
    $scope.showCheckout = true;
  }

  $scope.finishCheckout = function() {

    if ( !$scope.checkoutForm.$valid ) {
      $scope.error = "Please fill out all required fields";
    } else {

      Cart.checkout( $scope.checkout )
      .then( function( result ) {

        if ( result.error ) {
          $scope.error = result.error;
        } else {
          $state.go('account.orderDetails', { orderId: result._id });
        }

      })

    }

  }

}).factory( 'Cart', function( $http ) {

  var CartFactory = {};
  var cachedCart = null;

  CartFactory.fetch = function( force ) {

    if ( cachedCart && !force ) return cachedCart;

    return $http.get( '/api/cart' ).then( res => res.data )
    .then( function( cart ) {
      cachedCart = cart;
      return cachedCart;
    });

  }

  CartFactory.add = function( quantity, product ) {

    var data = {
      productId: typeof product === "object" ? product._id : product,
      quantity: quantity
    }

    return $http.post( '/api/cart', data )
    .then( function() {
      return CartFactory.fetch( true );
    });

  }

  CartFactory.edit = function( quantity, product ) {

    var data = {
      productId: typeof product === "object" ? product._id : product,
      quantity: quantity
    }

    return $http({
      method: 'PUT',
      url: '/api/cart', 
      data: data 
    })
    .then( function() {
      return CartFactory.fetch( true );
    });

  }

  CartFactory.remove = function( product ) {

    var productId = typeof product === "object" ? product._id : product

    return $http.delete( '/api/cart/' + productId )
    .then( function() {
      return CartFactory.fetch( true );
    });

  }

  CartFactory.checkout = function( payInfo ) {

    if ( cachedCart.paymentInfo ) return;

    return $http.post( '/api/orders/' + cachedCart._id, payInfo )
    .then( res => res.data )
    .then( function( finishedOrder ) {
      cachedCart = null;
      return finishedOrder;
    })
    .then( null, function( err ) {
      return { error: err };
    });

  }

  return CartFactory;

});