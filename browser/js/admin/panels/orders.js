app.controller( 'OrdersPanelCtrl', function( $scope, search, OrderFactory ) {

  $scope.search = search;

  OrderFactory.fetchAll()
  .then( function( orders ) {

    $scope.orders = orders;
    console.dir( orders );

  })

});