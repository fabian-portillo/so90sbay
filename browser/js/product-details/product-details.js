app.config( function ( $stateProvider ) {

  $stateProvider.state( 'productDetails', {

    url: '/products/:productId',
    templateUrl: '/js/product-details/product-details.html',
    controller: 'ProductDetailCtrl',
    resolve: {
      'product' : function( ProductFactory, $stateParams ) {
        return ProductFactory.getProductById( $stateParams.productId );
      },
      'reviews' : function( ProductFactory, $stateParams ) {
        return ProductFactory.getProductReviews( $stateParams.productId );
      }
    }

  });

}).controller( 'ProductDetailCtrl', function( $scope, product, reviews, Cart ) {

  $scope.product = product;
  $scope.product.reviews = reviews;

  $scope.mainImage = $scope.product.photo[0];

  $scope.addToCart = function() {
    Cart.add( 1, $scope.product._id );
  }

  $scope.changeMainImage = function( image ) {
    $scope.mainImage = image;
  }

});