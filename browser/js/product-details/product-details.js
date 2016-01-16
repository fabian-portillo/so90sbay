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

}).controller( 'ProductDetailCtrl', function( $scope, product, reviews, Cart, ReviewFactory ) {

  $scope.product = product;
  $scope.product.reviews = reviews;

  $scope.mainImage = $scope.product.photo[0];

  $scope.addToCart = function() {
    Cart.add( 1, $scope.product._id );
  }

  $scope.changeMainImage = function( image ) {
    $scope.mainImage = image;
  }

  $scope.visible = false;

  $scope.showForm = function() {
    $scope.visible = !($scope.visible);
    $scope.newReview = {
      title: null,
      body: null,
      rating: null,
      user: null,
      product: product._id
    }
  }

  $scope.newReview = {
    title: null,
    body: null,
    rating: null,
    user: null,
    product: product._id
  }

  $scope.setRating = function(rate) {
    $scope.newReview.rating = rate;
    $scope.currentRating = rate;
  }

  $scope.stars = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5
  };

  $scope.addReview = function () {
    ReviewFactory.addReview(newReview);

    $scope.newReview = {
      title: null,
      body: null,
      rating: null,
      user: null,
      product: product._id
    }

  }

});