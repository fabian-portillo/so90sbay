app.config( function( $stateProvider ) {

  $stateProvider.state( 'account.orderHistory', {

    url: '/orders',
    templateUrl: '/js/account/orders/orders.html',
    controller: 'OrderHistoryCtrl',
    resolve: {
      'user' : function( AuthService ) {
        return AuthService.getLoggedInUser();
      }
    }

  }).state( 'account.orderDetails', {

    url: '/orders/:orderId',
    templateUrl: '/js/account/orders/order-details.html',
    controller: 'OrderDetailsCtrl',
    resolve: {
      'user' : function( AuthService ) {
        return AuthService.getLoggedInUser();
      },
      'order' : function( OrderFactory, ProductFactory, $stateParams ) {
        return OrderFactory.fetchOne( $stateParams.orderId )
          .then( function( order ) {
            var getProducts = order.lineItems.map( function( li ) {
              return ProductFactory.getProductById( li.product );
            });

            return Promise.all( getProducts )
              .then( function( products ) {
                var newLis = order.lineItems.map( function( li, li_idx ) {
                  li.product = products[li_idx];
                  return li;
                })

                order.lineItems = newLis;
                return order;
              });
          });
      }
    }

  });

}).controller( 'OrderHistoryCtrl', function ( $scope, user, UserFactory ) {

  $scope.user = user;
  
  UserFactory.getOrders( user._id )
  .then( function( orders ) {

    return orders.filter( function( order ) {
      return order.paymentInfo !== null;
    });

  })
  .then( function( orders ) {

    $scope.orders = orders;

  })

}).controller( 'OrderDetailsCtrl', function ( $scope, user, order ) {

  $scope.user = user;
  $scope.order = order;
  $scope.total = order.lineItems.reduce( function ( sum, li ) {
    return sum + (li.price * li.quantity);
  }, 0);

});