app.controller( 'OrdersPanelCtrl', function( $scope, search, OrderFactory ) {

  $scope.search = search;

  $scope.showDetails = function( order ) {

    if ( $scope.order && $scope.order._id === order ) {

      $scope.orderDetails = true;

    } else {

      OrderFactory.fetchOne( order._id )
      .then( function( order ) {
    
        $scope.order = order;
        $scope.orderDetails = true;

      });

    }

  }

  $scope.hideDetails = function() {

    $scope.orderDetails = false;

  }

  $scope.saveDetails = function() {
  
    if ( !$scope.order || !$scope.orderDetails ) return;

    OrderFactory.update( $scope.order._id, $scope.order )
    .then( function( payInfo ) {

      $scope.order.paymentInfo = payInfo;

      OrderFactory.fetchAll()
      .then( function( orders ) {

        $scope.orders = orders;
        $scope.hideDetails();

      });

    });

  }

  OrderFactory.fetchAll()
  .then( function( orders ) {

    $scope.orders = orders;

  })

});
