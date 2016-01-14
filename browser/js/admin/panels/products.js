app.controller( 'ProductsPanelCtrl', function( $scope, ProductFactory ) {

  ProductFactory.getAllProducts()
  .then( function( products ) {

    $scope.products = products;
  
  })

});